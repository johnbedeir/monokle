import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import 'antd/dist/antd.less';
import {Button, Space} from 'antd';
import {ClusterOutlined, FolderOpenOutlined, ApartmentOutlined, CodeOutlined} from '@ant-design/icons';
import 'react-reflex/styles.css';
import {ReflexContainer, ReflexSplitter, ReflexElement} from 'react-reflex';

import Colors, {BackgroundColors} from '@styles/Colors';
import {AppBorders} from '@styles/Borders';
import {Layout, Row, Content} from '@atoms';
import {
  PageHeader,
  PageFooter,
  ActionsPane,
  NavigatorPane,
  FileTreePane,
  MessageBox,
  SettingsDrawer,
  DiffModal,
} from '@organisms';
import {LogViewer, GraphView} from '@molecules';
import {Size} from '@models/window';
import {useWindowSize} from '@utils/hooks';
import {useAppDispatch} from '@redux/hooks';
import {initKubeconfig} from '@redux/reducers/appConfig';
import featureJson from '@src/feature-flags.json';
import {APP_MIN_WIDTH} from '@src/constants';
import ClustersPane from '@organisms/ClustersPane';

const StyledReflexContainer = styled(ReflexContainer)`
  &.reflex-container {
    margin-top: 0px;
  }
  .ant-btn {
    line-height: 1.5715;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    border: 1px solid transparent;
    box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: manipulation;
    height: 40px;
    padding: 8px;
    font-size: 14px;
    border-radius: 2px;
    color: rgba(255, 255, 255, 0.85);
    background: transparent;
  }
  .ant-btn:hover,
  .ant-btn:focus {
    color: #165996;
    background: transparent;
    border-color: #165996;
  }
`;

const StyledReflexElement = styled(ReflexElement)`
  height: 100%;
  border-left: ${AppBorders.pageDivider};
  border-right: ${AppBorders.pageDivider};
  overflow-x: hidden;
  overflow-y: hidden;
`;

const StyledMenuLeftReflexElement = styled(ReflexElement)`
  &.reflex-element {
    margin: 3px;
  }
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const StyledMenuRightReflexElement = styled(ReflexElement)`
  &.reflex-element {
    margin: 3px;
  }
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`;
const StyledRow = styled(Row)`
  background-color: ${BackgroundColors.darkThemeBackground};
  width: 100%;
  padding: 0px;
  margin: 0px;
  overflow-y: hidden;
`;

const StyledContent = styled(Content)`
  overflow-y: clip;
  .reflex-container > .reflex-splitter {
    background-color: ${Colors.grey3};
    z-index: 100;
  }
  .reflex-container.vertical > .reflex-splitter {
    border-right: 1px solid ${Colors.grey3};
    border-left: 1px solid ${Colors.grey3};
    cursor: col-resize;
    height: 100%;
    width: 1px;
  }
`;

const iconStyle = {
  fontSize: 25,
};

const iconMenuWidth = 45;

const App = () => {
  const dispatch = useAppDispatch();
  const size: Size = useWindowSize();
  const contentWidth = size.width ? size.width - 2 * iconMenuWidth : APP_MIN_WIDTH;
  const mainHeight = `${size.height ? size.height : 100}px`;
  const contentHeight = `${size.height ? size.height - 75 : 75}px`;

  const [leftMenuSelection, setLeftMenuSelection] = useState('');
  const [rightMenuSelection, setRightMenuSelection] = useState('');
  const [rightPaneWidth, setRightPaneWidth] = useState(contentWidth * 0);
  const [navPaneWidth, setNavPaneWidth] = useState(contentWidth * 0.5);
  const [editPaneWidth, setEditPaneWidth] = useState(contentWidth * 0.5);
  const [leftPaneWidth, setLeftPaneWidth] = useState(contentWidth * 0);

  useEffect(() => {
    dispatch(initKubeconfig());
  }, []);

  const setAspectRatios = (side: string, buttonName: string) => {
    let left;
    let right;
    if (side === 'left') {
      left = leftMenuSelection === buttonName ? '' : buttonName;
      setLeftMenuSelection(left);
    } else left = leftMenuSelection;

    if (side === 'right') {
      right = rightMenuSelection === buttonName ? '' : buttonName;
      setRightMenuSelection(right);
    } else right = rightMenuSelection;

    /*
      Possible configurations (left, right) -> left: 25%, nav: 25%, edit:25%, right:25%
      cc: closed, closed -> left: 0%, nav: 50%, edit:50%, right:0% (default)
      oc: open, closed -> left: 33%, nav: 33%, edit:33%, right:0%
      co: closed, open -> left: 0%, nav: 33%, edit:33%, right:33%
      oo: open, open -> left: 25%, nav: 25%, edit:25%, right:25%
    */
    const cfg =
      left === '' && right === ''
        ? 'cc'
        : left !== '' && right === ''
        ? 'oc'
        : left === '' && right !== ''
        ? 'co'
        : 'oo';

    const leftSize = cfg === 'oc' ? contentWidth * 0.33 : cfg === 'oo' ? contentWidth * 0.25 : 0;
    const rightSize = cfg === 'co' ? contentWidth * 0.33 : cfg === 'oo' ? contentWidth * 0.25 : 0;
    const navEditSizes =
      cfg === 'oc' || cfg === 'co' ? contentWidth * 0.33 : cfg === 'oo' ? contentWidth * 0.25 : contentWidth * 0.5;

    setLeftPaneWidth(leftSize);
    setNavPaneWidth(navEditSizes);
    setEditPaneWidth(navEditSizes);
    setRightPaneWidth(rightSize);
  };

  return (
    <div>
      <MessageBox />
      <Layout style={{height: mainHeight}}>
        <PageHeader />
        <SettingsDrawer />

        <StyledContent style={{height: contentHeight}}>
          <StyledRow style={{height: contentHeight + 4}}>
            <StyledReflexContainer orientation="vertical" windowResizeAware>
              <StyledMenuLeftReflexElement size={43}>
                <Space direction="vertical">
                  <Button
                    size="large"
                    onClick={() => setAspectRatios('left', 'file-explorer')}
                    icon={
                      <FolderOpenOutlined
                        style={{
                          ...iconStyle,
                          color: leftMenuSelection === 'file-explorer' ? Colors.whitePure : Colors.grey7,
                        }}
                      />
                    }
                  />
                  {featureJson.ShowGraphView && (
                    <Button
                      size="large"
                      onClick={() => setAspectRatios('left', 'cluster-explorer')}
                      icon={
                        <ClusterOutlined
                          style={{
                            ...iconStyle,
                            color: leftMenuSelection === 'cluster-explorer' ? Colors.whitePure : Colors.grey7,
                          }}
                        />
                      }
                    />
                  )}
                </Space>
              </StyledMenuLeftReflexElement>
              {leftPaneWidth && (
                <StyledReflexElement size={leftPaneWidth}>
                  {leftMenuSelection === 'file-explorer' ? <FileTreePane windowHeight={size.height} /> : undefined}
                  {featureJson.ShowClusterView && leftMenuSelection === 'cluster-explorer' ? (
                    <ClustersPane />
                  ) : undefined}
                </StyledReflexElement>
              )}

              {leftPaneWidth && <ReflexSplitter />}

              <StyledReflexElement size={navPaneWidth}>
                <NavigatorPane />
              </StyledReflexElement>

              <ReflexSplitter />

              <StyledReflexElement size={editPaneWidth}>
                <ActionsPane contentHeight={contentHeight} />
              </StyledReflexElement>

              {rightPaneWidth && <ReflexSplitter />}

              {rightPaneWidth && (
                <StyledReflexElement size={rightPaneWidth}>
                  {featureJson.ShowGraphView && rightMenuSelection === 'graph' ? (
                    <GraphView editorHeight={contentHeight} />
                  ) : undefined}
                  {rightMenuSelection === 'logs' ? <LogViewer editorHeight={contentHeight} /> : undefined}
                </StyledReflexElement>
              )}

              <StyledMenuRightReflexElement size={43}>
                <Space direction="vertical">
                  {featureJson.ShowGraphView && (
                    <Button
                      size="large"
                      onClick={() => setAspectRatios('right', 'graph')}
                      icon={
                        <ApartmentOutlined
                          style={{
                            ...iconStyle,
                            color: rightMenuSelection === 'graph' ? Colors.whitePure : Colors.grey7,
                          }}
                        />
                      }
                    />
                  )}

                  <Button
                    size="large"
                    onClick={() => setAspectRatios('right', 'logs')}
                    icon={
                      <CodeOutlined
                        style={{...iconStyle, color: rightMenuSelection === 'logs' ? Colors.whitePure : Colors.grey7}}
                      />
                    }
                  />
                </Space>
              </StyledMenuRightReflexElement>
            </StyledReflexContainer>
          </StyledRow>
        </StyledContent>

        <PageFooter />
      </Layout>
      <DiffModal />
    </div>
  );
};

export default App;
