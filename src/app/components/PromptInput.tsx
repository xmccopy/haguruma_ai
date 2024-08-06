import { useEffect, useRef } from "react";

interface PromptInputProps {
    id: string;
    label: string;
    prompt: string;
    onChange: (newPrompt: string) => void;
    onSave: () => void;
}

const PromptInput = ({ id, label, prompt, onChange, onSave }: PromptInputProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            textarea.style.height = textarea.scrollHeight + 'px'; // Adjust height
        }
    };

    useEffect(() => {
        adjustHeight(); // Adjust height on mount and whenever the prompt changes

        // Add event listener to adjust height on window resize
        window.addEventListener('resize', adjustHeight);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', adjustHeight);
        };
    }, [prompt]);

    return (
        <div key={id}>
            <p className="text-[14px] text-[#1A1F36] font-bold mb-3">{label}</p>
            <div className="flex gap-4 mt-4">
                <textarea
                    ref={textareaRef}
                    className="w-full resize-none overflow-hidden p-[12px] text-base border-2 rounded-lg"
                    placeholder="Input prompt"
                    value={prompt}
                    onChange={(e) => {
                        onChange(e.target.value);
                        adjustHeight(); // Adjust height on input
                    }}
                    onInput={adjustHeight} // Adjust height on input
                />
                <button
                    onClick={onSave}
                    className="text-[14px] text-[#5469D4] min-w-max"
                    type="button"
                >
                    更新する
                </button>
            </div>
        </div>
    );
};

export default PromptInput;
