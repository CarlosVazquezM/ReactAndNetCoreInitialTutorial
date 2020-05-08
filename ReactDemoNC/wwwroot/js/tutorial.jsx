class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

    loadCommentsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        };
        xhr.send();
    }

    handleCommentSubmit(comment) {
        const data = new FormData();
        data.append('Author', comment.author);
        data.append('Comment', comment.comment);

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = () => this.loadCommentsFromServer();
        xhr.send(data);

    }

    componentWillMount() {
        this.loadCommentsFromServer();
        window.setInterval(
            () => this.loadCommentsFromServer(),
            this.props.pollInterval,
        );
    }

    render() {
        return (
            <div className="commentBox">
                <h1>CommentBox</h1>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                <CommentList data={this.state.data} />
            </div>
        );
    }


}

function createRemarkable() {
    var remarkable =
        'undefined' !== typeof global && global.Remarkable
            ? global.Remarkable
            : window.Remarkable;

    return new remarkable();
}

class CommentList extends React.Component {
    render() {
        const commentNodes = this.props.data.map(comment => (
            <Comment author={comment.author} key={comment.id}>{comment.comment}</Comment>
        ));
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
}

class Comment extends React.Component{
    rawMarkup() {
        const md = new Remarkable();
        const rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    }

    render() {
        return (
                <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
                </div>
        );
    }
}

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            author: '',
            comment: ''
        };
        this.handleAutorChange = this.handleAutorChange.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleAutorChange(e) {
        this.setState({ author: e.target.value });
    }

    handleCommentChange(e) {
        this.setState({ comment: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const comment = this.state.comment.trim();
        if (!comment || !author) {
            return;
        }
        this.props.onCommentSubmit({ author: author, comment: comment });
        this.setState({ author: '', comment: '' });
    }


    render() {
        return (
            <div className="commentForm" onSubmit={this.handleSubmit}>
                <form className="commentForm">
                    <input type="text" onChange={this.handleAutorChange} value={this.state.author} placeholder="Your name" />
                    <input type="text" onChange={this.handleCommentChange} value={this.state.comment} placeholder="Say Something" />
                    <input type="submit"  value="Post" />
                </form>
            </div>
        );
    }
}

const data = [
    { id: 1, author: 'Daniel Lo Nigro', text: 'Hello ReactJS.NET World!' },
    { id: 2, author: 'Pete Hunt', text: 'This is one comment' },
    { id: 3, author: 'Jordan Walke', text: 'This is *another* comment' },
];

ReactDOM.render(
    <CommentBox
        url="/comments"
        pollInterval={20000}
        submitUrl="/comments/new"
    />,
    document.getElementById('content')
);

