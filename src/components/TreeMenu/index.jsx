import React, { useState, useRef } from 'react';
import FolderCreate from '@modals/folder/create';
import CreateGroup from '@modals/CreateGroup';
import CreateScene from '@modals/CreateScene';
import { isUndefined } from 'lodash';
import useListData from './menuTree/hooks/useListData';
import useSceneData from './menuTree/hooks/useSceneData';
import usePlanData from './menuTree/hooks/usePlanData';
import useAutoPlanData from './menuTree/hooks/useAutoPlanData';
import { Button } from 'adesign-react';
import { useTranslation } from 'react-i18next';


import FilterBox from './filterBox';
import ButtonBox from './buttonBox';
import MenuTrees from './menuTree';
import SceneBox from './sceneBox';
import RecycleBin from './recycleBin';

import { MenuWrapper } from './style';

const TreeMenu = (props) => {
    const { type = 'apis', getSceneName, onChange, taskType } = props;
    const { t } = useTranslation();
    const [filterParams, setFilterParams] = useState({ key: '', status: 'all' }); // 接口过滤参数
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [modalType, setModalType] = useState('');
    const [modalProps, setModalProps] = useState(undefined);
    const [showRecycle, setShowRecycle] = useState(false);

    const treeRef = useRef(null);

    const listDataParam = useListData({ filterParams, selectedKeys });
    const sceneDataParam = useSceneData({ filterParams, selectedKeys });
    const planDataParam = usePlanData({ filterParams, selectedKeys });
    const autoPlanDataParam = useAutoPlanData({ filterParams, selectedKeys });

    const dataList = {
        'apis': listDataParam,
        'scene': sceneDataParam,
        'plan': planDataParam,
        'auto_plan': autoPlanDataParam
    };

    const dataParam = dataList[type];

    const handleShowModal = (mtype, mProps) => {
        setModalProps(mProps);
        setModalType(mtype);
    };
    return (
        <MenuWrapper>
            {modalType === 'addFolder' && !isUndefined(modalProps) && (
                <FolderCreate {...modalProps} onCancel={setModalType.bind(null, '')} />
            )}
            {modalType === 'addGroup' && (
                <CreateGroup from={type} {...modalProps} onCancel={setModalType.bind(null, '')} />
            )}
            {modalType === 'addScene' && (
                <CreateScene from={type} {...modalProps} onCancel={setModalType.bind(null, '')} />
            )}
            <div className='menus-header'>
                <FilterBox
                    treeRef={treeRef}
                    selectedKeys={selectedKeys}
                    filterParams={filterParams}
                    onChange={setFilterParams}
                    type={type}
                />
                {type === 'apis' ? <ButtonBox treeRef={treeRef} showModal={handleShowModal} /> : <SceneBox from={type} taskType={taskType} onChange={onChange} />}
            </div>
            <MenuTrees
                ref={treeRef}
                showModal={handleShowModal}
                {...dataParam}
                filterParams={filterParams}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                type={type}
                // getSceneName={getSceneName}
            />
            {/* { type === 'apis' && <RecycleBin /> } */}
        </MenuWrapper>
    )
};

export default TreeMenu; 