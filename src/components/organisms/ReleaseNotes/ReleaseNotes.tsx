import {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';

import {Button, Skeleton} from 'antd';

import path from 'path';

import {loadResource} from '@redux/services';

import {fetchAppVersion} from '@utils/appVersion';
import {openUrlInExternalBrowser} from '@utils/shell';

import * as S from './styled';

type ReleaseNotesProps = {
  onClose: () => void;
};

const ReleaseNotes: React.FC<ReleaseNotesProps> = ({onClose}) => {
  const [title, setTitle] = useState<string>();
  const [learnMoreUrl, setLearnMoreUrl] = useState<string>();
  const [markdown, setMarkdown] = useState<string>();
  const [base64svg, setBase64svg] = useState<string>();

  useEffect(() => {
    fetchAppVersion().then(version => {
      const rawVersionInfo = loadResource(path.join('releaseNotes', version, `${version}.json`));
      const rawMarkdown = loadResource(path.join('releaseNotes', version, `${version}.md`));
      const rawSvg = loadResource(path.join('releaseNotes', version, `${version}.svg`));
      if (!rawVersionInfo || !rawMarkdown || !rawSvg) {
        onClose();
        return;
      }
      const versionInfo = JSON.parse(rawVersionInfo);
      setTitle(versionInfo.title);
      setLearnMoreUrl(versionInfo.learnMoreUrl);
      setMarkdown(rawMarkdown);
      setBase64svg(Buffer.from(rawSvg).toString('base64'));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!title || !learnMoreUrl || !markdown) {
    return <Skeleton />;
  }

  return (
    <div>
      <S.Container>
        <S.Content>
          <S.Title>{title}</S.Title>
          <ReactMarkdown
            components={{
              a({href, children, ...props}) {
                return (
                  <a onClick={() => openUrlInExternalBrowser(href)} {...props}>
                    {children}
                  </a>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </S.Content>
        <S.Illustration>
          <S.Image src={`data:image/svg+xml;base64,${base64svg}`} alt="Release illustration" />
        </S.Illustration>
      </S.Container>
      <S.Actions>
        <Button type="ghost" onClick={() => openUrlInExternalBrowser(learnMoreUrl)}>
          Learn more
        </Button>
        <Button onClick={onClose} type="primary" style={{marginLeft: 8}}>
          Got it
        </Button>
      </S.Actions>
    </div>
  );
};

export default ReleaseNotes;
