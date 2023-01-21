import {useCallback} from 'react';

export const useSetProductFavorite = (id: string | undefined) => {
    // TODO: Here make API call and remove this fake interface and function
    interface Variables {
        variables: {
            id: string | undefined;
            fav: boolean;
        }
    }

    const innerUpdateProduct = (variables: Variables) => {
        return variables;
    };

    return useCallback((fav: boolean) => {
        if (id === undefined) {
            return;
        }
        innerUpdateProduct({variables: {id, fav}});
    }, [id, innerUpdateProduct]);
};