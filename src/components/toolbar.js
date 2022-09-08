
export default function Toolbar(props) {

    function saveButton() {
      console.log(props.editorContent);
    };

    return (
        <div className="toolbar">
          <button className="save-button" onClick={saveButton}>
              Spara
          </button>
        </div>
      );
  }
