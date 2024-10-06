import React, { useState, useEffect } from 'react';
import './CreateDrawing.css';
import { useDojo } from '../dojo/useDojo';
import { Account } from 'starknet';
import { SettingsInfos } from '../customTypes';

function getRandomFelt252() {
  const maxFelt252 = (BigInt(1) << BigInt(252)) - BigInt(1); // 2^252 - 1
  
  const randomArray = new Uint8Array(32); // 32 bytes = 256 bits
  window.crypto.getRandomValues(randomArray);

  // Convert random bytes to a BigInt
  let randomValue = BigInt('0x' + [...randomArray].map(b => b.toString(16).padStart(2, '0')).join(''));

  // Ensure the random value is within the range of felt252 (0 <= randomValue < 2^252)
  return randomValue % maxFelt252;
}




interface CreateDrawingProps {
  account: Account | undefined;
  handleCreateDrawing: (newDrawing: { id: number, name: string; pixelsRowCount: number; creator: string }) => void;
  settings: SettingsInfos | undefined;
}

const CreateDrawing: React.FC<CreateDrawingProps> = ({ account, handleCreateDrawing, settings }) => {
  if (!settings) {
    return <div>Loading Settings...</div>;
  }

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [nameError, setNameError] = useState('');
  const [symbolError, setSymbolError] = useState('');
  const [accountError, setAccountError] = useState(''); // Error message for missing account

  const { setup: { systemCalls: { createDrawing } } } = useDojo();

  useEffect(() => {
    if (account) {
      setAccountError(''); // Clear account error when the account is connected
    }
  }, [account]);

  // Validation for name and symbol length (max 31 characters)
  const validateFields = () => {
    let isValid = true;

    if (!name) {
      setNameError('Name is required.');
      isValid = false;
    } else if (name.length > 31) {
      setNameError('Name cannot exceed 31 characters.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!symbol) {
      setSymbolError('Symbol is required.');
      isValid = false;
    } else if (symbol.length > 31) {
      setSymbolError('Symbol cannot exceed 31 characters.');
      isValid = false;
    } else {
      setSymbolError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!account) {
      setAccountError('You need to connect your account.');
      return;
    }

    if (validateFields()) {
      setIsCreating(true);
      // let rdmSalt = getRandomFelt252();
      let rdmSalt = BigInt(Math.floor(Math.random() * 10000000));
      let drawingId = await createDrawing(account, name, symbol, rdmSalt);
      setIsCreating(false);
      if (drawingId !== -1) {
        handleCreateDrawing({ id: drawingId, name, pixelsRowCount: settings.pixelsRowCount, creator: account.address });
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) {
      setNameError('');
    }
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
    if (symbolError) {
      setSymbolError('');
    }
  };

  return (
    <div className="create-drawing">
      <div className='create-drawing-title'>Create New Drawing</div>
      <div className="create-drawing-container">
        <div className="form-field">
          <div className="input-title">Drawing Name</div>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className={nameError ? 'error-border' : ''}
            required
          />
          {nameError && (
            <div className="error-message">{nameError}</div>
          )}
        </div>

        <div className="form-field">
          <div className="input-title">Symbol</div>
          <input
            type="text"
            value={symbol}
            onChange={handleSymbolChange}
            className={symbolError ? 'error-border' : ''}
            required
          />
          {symbolError && (
            <div className="error-message">{symbolError}</div>
          )}
        </div>

        {accountError && (
          <div className="error-message account-error">{accountError}</div>
        )}

        {isCreating ? (
          <div className="submit-btn">
            Creating...
          </div>
        ) : (
          <div className="submit-btn" onClick={handleSubmit}>
            Create
          </div>
        )}
      </div>
      <div className='create-drawing-infos'>
        A {settings.pixelsRowCount} by {settings.pixelsColumnCount} square canvas will be created
      </div>
    </div>
  );
};

export default CreateDrawing;
