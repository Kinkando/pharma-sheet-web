import { CloudUpload } from '@mui/icons-material';
import { ChangeEvent, DragEvent, useState } from 'react';

export type DropFileProps = {
  onSelect: (file: FileList) => void;
  disabled?: boolean;
  multiple?: boolean;
};

export function DropFile({ onSelect, disabled, multiple }: DropFileProps) {
  const [highlight, setHighlight] = useState(false);
  const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;
    if (fileInput && fileInput?.files?.length) {
      onSelect(fileInput.files);
      fileInput.value = '';
    }
  };
  const drag = (highlight: boolean) => {
    return (e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setHighlight(highlight);
    };
  };
  return (
    <>
      <label
        htmlFor="select-file"
        onDragOver={drag(true)}
        onDragLeave={drag(false)}
        draggable
      >
        <div
          className={
            'aspect-square rounded-md bg-gray-100 hover:bg-blue-100 ease-in duration-200 cursor-pointer w-full' +
            (highlight ? ' bg-blue-100' : '')
          }
        >
          <div className="rounded-md border-gray-500 border-dotted w-[90%] h-[90%] flex items-center justify-center relative top-[5%] left-[5%]">
            <div>
              <div className="text-gray-400 w-fit m-auto">
                <CloudUpload fontSize="large" />
              </div>
              <span className="font-bold">Choose a file</span>
              <br />
              or drag it here.
            </div>
          </div>
        </div>
      </label>
      <input
        id="select-file"
        type="file"
        multiple={multiple}
        accept="image/*"
        hidden
        onChange={selectFile}
        disabled={disabled}
      />
    </>
  );
}
