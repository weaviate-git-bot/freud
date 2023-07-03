import React, { useState } from 'react'

type SourceProps = {
    text: string
}

//Component with button for hiding and showing 'content'
const SourceComponent = ({ text }: SourceProps) => {
    const [shown, setShown] = useState(false);
    return (
        <>
            <button className='text-white' onClick={() => { setShown(!shown) }}>{shown ? 'Show less' : 'Show more'}</button>
            <p>{shown ? text : ''}</p>
        </>
    )
}

export default SourceComponent