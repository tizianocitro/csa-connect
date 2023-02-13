import React from 'react';
import {useLocation, useRouteMatch} from 'react-router-dom';

const SectionDetails = () => {
    const {url, path, params: {sectionId}} = useRouteMatch<{sectionId: string}>();
    const {hash: urlHash} = useLocation();

    return (
        <div>
            {'Section ' + sectionId + ' details'}
        </div>
    );
};

export default SectionDetails;