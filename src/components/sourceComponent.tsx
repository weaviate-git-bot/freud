import React, { useState } from 'react'
import { Source } from '~/interfaces/message';

type SourceProps = {
    source: Source
}

//Component with button for hiding and showing 'content'
const SourceComponent = ({ source }: SourceProps) => {
    const [shown, setShown] = useState(false);
    return (
        <li>
            {source.title} av {source.author}, s.{" "}
            {source.location.pageNr} (linje{" "}
            {source.location.lineFrom}-{source.location.lineTo})
            <br />
            <button className='text-white' onClick={() => { setShown(!shown) }}>{shown ? 'Show less' : 'Show more'}</button>
            <p>{shown ? source.content : ''}</p>
        </li>
    )
}

export default SourceComponent