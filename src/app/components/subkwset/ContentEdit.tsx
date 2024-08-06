'use client';

import { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import InputWindow from "./InputWindow";

interface ContentEditProps {
    configcontent: string;
    onContentChange: (newContent: string) => void;
}

const ContentEdit: React.FC<ContentEditProps> = ({ configcontent, onContentChange }) => {
    const [isActive, setIsActive] = useState(false);
    const [content, setContent] = useState(configcontent);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleActivate = () => {
        setIsActive(!isActive);
    };
    useEffect(() => {
        adjustHeight();
    }, [content]);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        onContentChange(newContent);///add content modify
        console.log("content updated:", newContent);
    }
    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };
    return (
        <tr className="cursor-pointer">
            <td className="w-full px-4 py-2 font-medium text-gray-900 text-[16px]">
                {isActive ? (
                    <InputWindow
                        isActive={isActive}
                        initialContent={content}
                        onContentChange={handleContentChange}
                    />
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        wrap="hard"
                        readOnly
                        className={`w-full p-1 h-6 leading-25 resize-none focus:outline-none focus:border-none overflow-hidden rounded-md ${isActive ? 'bg-white text-black' : 'bg-gray-100 text-gray-500'} `}
                    />
                )}
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-[14px]">
                <FaPencilAlt onClick={handleActivate} className="cursor-pointer" />
            </td>
        </tr>
    );
};

export default ContentEdit;
