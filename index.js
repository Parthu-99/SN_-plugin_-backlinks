import React, { Component } from 'react';
import { Editor, Toolbar } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.note.content,
      backlinks: [],
    };
  }

  componentDidMount() {
    this.editor = new Editor({
      el: this.editorRef,
      value: this.state.content,
      mode: 'markdown',
    });
    this.getBacklinks();
  }

  getBacklinks = () => {
    // Get the backlinks for the current note.
    const url = `/api/v1/notes/${this.props.note.id}/backlinks`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(backlinks => {
        this.setState({ backlinks });
      });
  };

  onChange = (content) => {
    this.setState({ content });
    this.getBacklinks();
  };

  render() {
    return (
      <div>
        <Toolbar />
        <div ref={(el) => this.editorRef = el} />
        <div>
          <h2>Backlinks</h2>
          {this.state.backlinks.map((backlink, index) => (
            <p key={index}>{backlink.title}</p>
          ))}
        </div>
      </div>
    );
  }
}

export default Note;
