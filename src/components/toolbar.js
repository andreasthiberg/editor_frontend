
export default function Toolbar(props) {

    return (
        <div className="toolbar">
          <button className="save-button" onClick={props.saveDocument}>
              Spara
          </button>
          <button className="save-button" onClick={props.newDocument}>
              Nytt dokument
          </button>
          <button className="save-button" onClick={props.removeAllDocuments}>
              Ta bort alla dokument
          </button>
        </div>
        
      );
  }
