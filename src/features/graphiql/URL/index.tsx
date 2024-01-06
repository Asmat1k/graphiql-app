/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { BookOutlined } from '@ant-design/icons';
import { useAppSelector } from '../../../app/appHooks';
import useUrlHook from './model/useUrlHook';
import styles from './UI/URL.module.scss';
import commonStyles from '../../../shared/common.module.scss';
import { useSchemaFetcher } from '../Documentation/model/getShema';
import { message } from 'antd';

interface InputURLProps {
  language: string;
  handleDocsIconClick: (prop?: boolean) => void;
}

const errorEn = 'Wrong endpoint!';
const errorRu = 'Неверный адрес!';

const succesEn = 'Endpoint accepted';
const succesRu = 'Адрес принят!';

export default function InputURL({ language, handleDocsIconClick }: InputURLProps) {
  const isEn = language === 'EN';

  const { url } = useAppSelector((state) => state.root);
  const [input, setInput] = useState<string>(url);
  const handleURL = useUrlHook();
  const handleSchema = useSchemaFetcher();
  const [isDocsIconVisible, setIsDocsIconVisible] = useState(false);

  useEffect(() => {
    handleSchema(url).then(() => {
      setIsDocsIconVisible(true);
    });
  }, [url]);

  const handleIconClick = () => {
    handleDocsIconClick();
  };

  const handleSubmit = async () => {
    if (input !== url) {
      setIsDocsIconVisible(false);
    }
    handleDocsIconClick(false);
    handleURL(input);

    const response = await handleSchema(input);
    if (!response) message.error(isEn ? errorEn : errorRu);
    else message.success(isEn ? succesEn : succesRu);
  };

  return (
    <div className={styles.urlContainer}>
      {isDocsIconVisible && <BookOutlined className={styles.docsIcon} title="Docs" onClick={handleIconClick} />}
      <input
        defaultValue={url}
        placeholder="enter graphql endpoint url"
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <button className={commonStyles.button} onClick={handleSubmit}>
        {isEn ? 'Submit' : 'Отправить'}
      </button>
    </div>
  );
}
