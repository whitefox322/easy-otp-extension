import React, { useState, useEffect } from 'react';
import speakeasy from '@levminer/speakeasy';

import {
  HELP_TEXT,
  COPIED_MESSAGE,
  STORAGE_TOKEN_KEY,
  TOKEN_EXISTS_MESSAGE,
  CODE_EXPIRATION_WARNING,
  TOKEN_NOT_EXISTS_MESSAGE,
} from './constants.js';
import './Popup.css';

function getChromeStorageToken(setToken) {
  chrome.storage.local.get(STORAGE_TOKEN_KEY, function (result) {
    setToken(result[STORAGE_TOKEN_KEY]);
  });
}

function setChromeStorageToken(token) {
  chrome.storage.local.set({ [STORAGE_TOKEN_KEY]: token });
}

export const debounce = (time) => (fn) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), time);
  };
};


const Popup = () => {
  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [copiedMessage, setCopiedMessage] = useState('');

  const onInputChange = (e) => setValue(e.target.value);

  const handleTokenChange = (newToken) => {
    setToken(newToken);
    setChromeStorageToken(newToken);
    setError('');
  };

  const onTokenChange = (newToken) => {
    if (!!value) {
      handleTokenChange(newToken);
      setValue('');
    } else {
      setError('Please provide valid 2FA token');
    }
  };

  const clearCopiedMessage = debounce(5000)(
    () => setCopiedMessage(CODE_EXPIRATION_WARNING),
  );

  const onGenerateCodeByToken = (actualToken) => {
    const newCode = speakeasy.totp({ secret: actualToken, encoding: 'base32' });
    setCode(newCode);
    setError('');

    navigator.clipboard.writeText(newCode);
    setCopiedMessage(COPIED_MESSAGE);
    clearCopiedMessage();
  }

  useEffect(() => {
    getChromeStorageToken(setToken);
  }, []);

  const isCopied = copiedMessage === COPIED_MESSAGE;

  return (
    <div className="popup">
      <div className="text">
        {token ? TOKEN_EXISTS_MESSAGE : TOKEN_NOT_EXISTS_MESSAGE}
      </div>
      <div className="row">
        <input className="input" value={value} onChange={onInputChange} />
        {!token && (
          <button
            className="btn insert"
            onClick={() => onTokenChange(value)}
          >
            Insert
          </button>
        )}
      </div>
      {!!error && (
        <div className="row">
          <div className="error">
            {error}
          </div>
        </div>
      )}
      {!!token && (
        <>
          <div className="row center">
            <button
              className="btn update"
              onClick={() => onTokenChange(value)}
            >
              Update
            </button>
            <button
              className="btn remove"
              onClick={() => handleTokenChange(null)}
            >
              Remove
            </button>
          </div>
          <div style={{ marginTop: 20 }} />
          <div className="row center">
            <div className="text">
              {HELP_TEXT}
            </div>
          </div>
          <div className="row center">
            <input className="holder preview" value={code} readOnly />
            <button
              className="btn insert preview"
              onClick={() => onGenerateCodeByToken(token)}
            >
              Generate
            </button>
          </div>
          {!!copiedMessage && (
            <div className="row center">
              <div className={isCopied ? 'copied' : 'warning'}>
                {copiedMessage}
              </div>
            </div>
          )}
          <div style={{ marginTop: 20 }} />
        </>
      )}
    </div>
  );
};

export default Popup;
