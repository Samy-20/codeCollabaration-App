import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { ACTIONS } from "../../Action.js";

function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current = editor;
      editor.setSize(null, "100%");

      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue(); // Get the current code
        onCodeChange(code); // Call the onCodeChange prop

        // Emit code change to the server if not setValue
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    };

    init();

    // Cleanup function to remove the editor instance
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea(); // Clean up CodeMirror instance
        editorRef.current = null; // Clear the reference
      }
    };
  }, [socketRef, roomId, onCodeChange]);

  // Listen for incoming code changes from the server
  useEffect(() => {
    if (socketRef.current) {
      const handleCodeChange = ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code); // Update the editor with new code
        }
      };

      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      // Cleanup the event listener
      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef]);

  return (
    <div style={{ height: "600px" }} className="px-4">
      <textarea id="realtimeEditor" style={{ display: "none" }}></textarea>
    </div>
  );
}

export default Editor;