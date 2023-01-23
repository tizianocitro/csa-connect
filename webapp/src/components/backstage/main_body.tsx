import React from 'react';
import {
    Redirect,
    Route,
    Switch,
    matchPath,
    useHistory,
    useLocation,
    useRouteMatch,
} from 'react-router-dom';

import {useDispatch, useSelector} from 'react-redux';

import {getCurrentTeamId, getMyTeams} from 'mattermost-redux/selectors/entities/teams';

import {useEffectOnce, useLocalStorage, useUpdateEffect} from 'react-use';

import {selectTeam} from 'mattermost-redux/actions/teams';

import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {ErrorPageTypes} from 'src/constants';
import {pluginErrorUrl, pluginUrl} from 'src/browser_routing';
import ErrorPage from 'src/components/error_page';
import ProductsPage from 'src/components/backstage/products_page';

const useInitTeamRoutingLogic = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const {url} = useRouteMatch();
    const teams = useSelector(getMyTeams);
    const currentTeamId = useSelector(getCurrentTeamId);
    const currentUserId = useSelector(getCurrentUserId);

    // ? consider moving to multi-product or plugin infrastructure
    // see https://github.com/mattermost/mattermost-webapp/blob/25043262dbab1fc2f9ac6972b1f1b0b1f9c20ae0/stores/local_storage_store.jsx#L9
    const [prevTeamId, setPrevTeamId] = useLocalStorage(`user_prev_team:${currentUserId}`, teams[0].id, {raw: true});

    /**
     * * These routes will select the proper team they belong too.
     * ! Don't restore prev team on these routes or those routes will redirect back to default route.
     * @see {useDefaultRedirectOnTeamChange}
     */
    const negateTeamRestore = matchPath<{productId?: string;}>(location.pathname, {
        path: [
            `${url}/products/:productId`,
        ],
    });

    useEffectOnce(() => {
        if (prevTeamId && !negateTeamRestore) {
            // restore prev team
            dispatch(selectTeam(prevTeamId));
        }
    });

    useUpdateEffect(() => {
        setPrevTeamId(currentTeamId);
    }, [currentTeamId]);
};

/**
 * Use this hook to redirect back to the default route when a different team is selected while on a team-scoped page.
 * ! This is to ensure that a team mismatch doesn't occur when viewing a Playbook or Run and then selecting another team.
 * @param teamScopedModelTeamId team id from team-scoped entity (e.g. a Playbook or PlaybookRun)
 */
export const useDefaultRedirectOnTeamChange = (teamScopedModelTeamId: string | undefined) => {
    const history = useHistory();
    const currentTeamId = useSelector(getCurrentTeamId);
    useUpdateEffect(() => {
        if (
            currentTeamId &&
            teamScopedModelTeamId &&
            currentTeamId !== teamScopedModelTeamId
        ) {
            // team mismatch, go back to start
            history.push(pluginUrl(''));
        }
    }, [currentTeamId]);
};

const MainBody = () => {
    const match = useRouteMatch();
    useInitTeamRoutingLogic();

    return (
        <Switch>
            <Redirect
                from={`${match.url}/product/:productId`}
                to={`${match.url}/products/:productId`}
            />
            <Route path={`${match.url}/products/:productId`}>
                <ProductsPage/>
            </Route>
            <Redirect
                from={`${match.url}/product`}
                to={`${match.url}/products`}
            />
            <Route path={`${match.url}/products`}>
                <ProductsPage/>
            </Route>
            <Route path={`${match.url}/error`}>
                <ErrorPage/>
            </Route>
            <Route
                exact={true}
                path={`${match.url}/`}
            >
                <Redirect to={`${match.url}/products`}/>
            </Route>
            <Route>
                <Redirect to={pluginErrorUrl(ErrorPageTypes.DEFAULT)}/>
            </Route>
        </Switch>
    );
};

export default MainBody;
