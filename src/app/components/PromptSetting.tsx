'use client'

import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import PromptInput from "./PromptInput"; // Import the custom component

interface Prompt {
    id: string;
    prompt: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

const PromptSetting = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const toast = useRef<Toast>(null);
    const [selectedModel, setSelectedModel] = useState<string>('');

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL!}/prompt`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const promptsData = response.data?.allPrompt;
                setPrompts(promptsData);
            } catch (error) {
                console.error('Failed to fetch prompts:', error);
                // Handle error (e.g., show error message to user)
            }
        };

        fetchPrompts();
    }, []);

    useEffect(() => {
        const fetchAIModel = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL!}/ai-model`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                );

                const aiModel = response.data;
                console.log("_+_+_+_+_+_+_+_+_", aiModel);
                setSelectedModel(aiModel.model);
            } catch (error) {
                console.error('Failed to fetch AI tool:', error);
            }
        }

        fetchAIModel();
    }, []);

    const updatePrompt = useCallback(async (id: string, newPrompt: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL!}/prompt/${id}`,
                { prompt: newPrompt },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Update the local state
            setPrompts(prevPrompts =>
                prevPrompts.map(p => p.id === id ? { ...p, prompt: newPrompt } : p)
            );

            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Prompt updated successfully!', life: 2000 });
            }
            console.log(`Prompt updated successfully`);

        } catch (error) {
            console.error(`Failed to update prompt:`, error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An error occurred during updating prompt', life: 2000 });
        }
    }, []);

    const updateModel = async (model: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL!}/ai-model`,
                { model },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSelectedModel(model);

            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Model updated successfully!', life: 2000 });
            }
            console.log(`Model updated successfully`);

        } catch (error) {
            console.error(`Failed to update model:`, error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An error occurred during updating model', life: 2000 });
        }
    };

    const getPromptByType = (type: string) => prompts.find(p => p.type === type) || { id: '', prompt: '' };

    return (
        <div className="flex flex-col gap-6 mt-6">
            <div className="flex items-end justify-center gap-10 sm:mr-40">
                <div className="flex items-center justify-center gap-4">
                    <input
                        type="radio"
                        name="model"
                        value="chatgpt"
                        checked={selectedModel === "chatgpt"}
                        onChange={(e) => updateModel(e.target.value)}
                    />
                    <p className="text-base font-bold">ChatGPT</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <input
                        type="radio"
                        name="model"
                        value="claude"
                        checked={selectedModel === "claude"}
                        onChange={(e) => updateModel(e.target.value)}
                    />
                    <p className="text-base font-bold">Claude3.5</p>
                </div>
            </div>
            <Toast ref={toast} />
            {[
                { label: "タイトルプロンプト", type: "title" },
                { label: "構成プロンプト", type: "config" },
                { label: "イメージプロンプト", type: "image" },
                { label: "内容プロンプト", type: "article" }
            ].map(({ label, type }) => {
                const { id, prompt } = getPromptByType(type);

                return (
                    <PromptInput
                        key={type}
                        id={id}
                        label={label}
                        prompt={prompt}
                        onChange={(newPrompt) => setPrompts(prevPrompts =>
                            prevPrompts.map(p => p.id === id ? { ...p, prompt: newPrompt } : p)
                        )}
                        onSave={() => updatePrompt(id, prompt)}
                    />
                );
            })}
        </div>
    )
}

export default PromptSetting;
