import { Link } from "react-router-dom"
 import "../styles/completed.css"

function AlreadyCompleted() {
    document.title = "Already Completed - Space Odyssey| ISTE Students' Chapter NIT Durgapur"

    return (<div className="completed">
        <h2>Thanks for playing!</h2>
        <div>
            You have completed the game. We are happy to see that you enjoyed 😊.
            If you have any suggestions
            <Link to="#feedback">
                please feel free to share them here
            </Link>.
        </div>
    </div>)
}

export default AlreadyCompleted