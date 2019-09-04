import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendWord } from './PlayWordActions';

export function PlayWord() {
    const [currentValue, setCurrentValue] = React.useState('');
    const { error } = useSelector(state => state.playWordReducer);
    const dispatch = useDispatch();

    const playWord = e => {
        e.preventDefault();
        dispatch(sendWord(currentValue));
        setCurrentValue('');
    }

    return (
        <>
            <span data-cy="play-word">Type in the word that best describes the card you picked</span>
            <form data-cy="play-word-form" onSubmit={playWord}>
                <input onChange={e => setCurrentValue(e.target.value)} value={currentValue} placeholder="Type a word" data-cy='type-word' autoFocus />
                <button data-cy="send-word" type='submit'>Send word</button>
            </form>
            {error && <span className='error-text' data-cy= 'send-error'>{error}</span>}
        </>
    );
}

export default PlayWord;
