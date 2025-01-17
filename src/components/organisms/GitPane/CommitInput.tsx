import {useState} from 'react';

import {Button, Input, Tooltip} from 'antd';

import {CheckOutlined} from '@ant-design/icons';

import {TOOLTIP_DELAY} from '@constants/constants';
import {CommitTooltip} from '@constants/tooltips';

import {useAppSelector} from '@redux/hooks';

import {promiseFromIpcRenderer} from '@utils/promises';

import * as S from './CommitInput.styled';

type IProps = {
  hideCommitInputHandler: () => void;
};

const CommitInput: React.FC<IProps> = props => {
  const {hideCommitInputHandler} = props;

  const selectedProjectRootFolder = useAppSelector(state => state.config.selectedProjectRootFolder);

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCommit = async () => {
    if (!message) {
      setErrorMessage('Commit message must not be empty!');
      return;
    }

    setLoading(true);

    await promiseFromIpcRenderer('git.commitChanges', 'git.commitChanges.result', {
      localPath: selectedProjectRootFolder,
      message,
    });

    setMessage('');
    setLoading(false);
    hideCommitInputHandler();
  };

  return (
    <>
      <S.CommitInputContainer>
        <Input
          onChange={e => {
            setMessage(e.currentTarget.value);
            if (errorMessage) {
              setErrorMessage('');
            }
          }}
          value={message}
          placeholder="Commit message"
        />

        <Tooltip mouseEnterDelay={TOOLTIP_DELAY} title={CommitTooltip}>
          <Button loading={loading} type="primary" onClick={handleCommit}>
            <CheckOutlined />
          </Button>
        </Tooltip>
      </S.CommitInputContainer>

      {errorMessage ? <S.ErrorLabel>{errorMessage}</S.ErrorLabel> : null}
    </>
  );
};

export default CommitInput;
