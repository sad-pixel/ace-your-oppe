import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-border">
      <CodeMirror
        value={value}
        height="100%"
        theme={vscodeDark}
        extensions={[sql()]}
        onChange={onChange}
        className="h-full text-sm"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          autocompletion: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
