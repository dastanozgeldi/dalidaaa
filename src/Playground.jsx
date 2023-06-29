import { useState } from 'react'
import './Playground.css'

function Playground() {
    const [offsetRight, setOffsetRight] = useState(0)
    const [offsetLeft, setOffsetLeft] = useState(0)
    const [results, setResults] = useState("")

    const pushLeft = () => {
        setOffsetRight(offsetRight + 3)
        if (offsetRight - offsetLeft > 48) {
            setResults("Player Pushing Left won!")
        }
    }

    const PushRight = () => {
        setOffsetLeft(offsetLeft + 3)
        if (offsetLeft - offsetRight > 48) {
            setResults("Player Pushing Right won!")
        }
    }

    return (
        <div className="playground">
            <h3>Rectangle Pushers</h3>
            <div className="rectangle" style={{ marginRight: `${offsetRight}px`, marginLeft: `${offsetLeft}px` }} />
            <button style={{ marginTop: "15px" }} onClick={PushRight}>
                PushRight
            </button>
            <button style={{ marginTop: "15px" }} onClick={pushLeft}>
                PushLeft
            </button>
            <button style={{ marginTop: "15px" }} onClick={() => { setOffsetLeft(0); setOffsetRight(0); setResults("") }}>
                Set zero
            </button>
            <div className="threshold" />

            <h3>{results}</h3>

        </div>
    )
}

export default Playground