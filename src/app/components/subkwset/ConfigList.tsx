'use client';

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ConfigEdit from './ConfigEdit';
import { BsPlusCircleDotted } from 'react-icons/bs';

interface Subtitle {
    id: string;
    tag: string;
    text: string;
}

interface Config {
    id: string;
    tag: string;
    text: string;
    subtitles: Subtitle[];
}

interface ConfigListProps {
    configs: Config[];
    addH3: (h2Index: number) => void;
    onDeleteConfig: (configId: string) => void;
    onDeleteSubtitle: (configId: string, subtitleId: string) => void;
    onConfigChange: (configId: string, newText: string) => void;  // Add this prop to handle config changes
    onSubtitleChange: (configId: string, subtitleId: string, newText: string) => void;  // Add this prop to handle subtitle changes
}

const ConfigList: React.FC<ConfigListProps> = ({ configs, addH3, onDeleteConfig, onDeleteSubtitle, onConfigChange, onSubtitleChange }) => {
    return (
        <Droppable droppableId="configs" type="h2">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {configs !== null && (
                        configs.map((config, index) => (
                            <Draggable key={config.id} draggableId={config.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className='ml-4'
                                    >
                                        <div className='flex items-center justify-start gap-1'>
                                            <h2 className='font-bold'>h2</h2>
                                            <ConfigEdit
                                                configcontent={config.text}
                                                onDelete={() => onDeleteConfig(config.id)}
                                                onSave={(newContent) => onConfigChange(config.id, newContent)}
                                            />
                                        </div>
                                        <Droppable droppableId={`h2-${index}`} type="h3">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {config.subtitles.map((subtitle, subIndex) => (
                                                        <Draggable
                                                            key={subtitle.id}
                                                            draggableId={subtitle.id}
                                                            index={subIndex}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className='flex ml-6 text-[14px]'
                                                                >
                                                                    <div className='flex items-center justify-start gap-1'>
                                                                        <h3>h3</h3>
                                                                        <ConfigEdit
                                                                            configcontent={subtitle.text}
                                                                            onDelete={() => onDeleteSubtitle(config.id, subtitle.id)}
                                                                            onSave={(newContent) => onSubtitleChange(config.id, subtitle.id, newContent)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                        <div onClick={() => addH3(index)} className="flex items-center justify-start gap-4 my-4 ml-5 hover:font-bold">
                                            <BsPlusCircleDotted size={25} />
                                            <p>h3 追加</p>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))
                    )}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default ConfigList;
