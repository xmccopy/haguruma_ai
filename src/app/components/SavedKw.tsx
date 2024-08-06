'use client'

import Button from "./Button";
import { IoFilter } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Credit from "./modals/Credit";
import { FaStar } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

interface Keyword {
    id: string;
    keyword: string;
    volume: string;
    status: string;
    selected: boolean;
    articleId?: string;
    createdAt?: string;
}

interface SavedKwProps {
    setKeywordsDL: React.Dispatch<React.SetStateAction<Keyword[]>>;
    initialKeywords: Keyword[];
    searchTerm: string;
    handleKeywordSelection: (keywordId: string) => void;
}

const SavedKw: React.FC<SavedKwProps> = ({ setKeywordsDL, initialKeywords, searchTerm, handleKeywordSelection }) => {
    const router = useRouter();
    const [filterShow, setFilterShow] = useState(false);
    const [keywords, setKeywords] = useState<Keyword[]>(initialKeywords);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreditModal, setShowCreditModal] = useState(false);
    const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
    const [selectAll, setSelectAll] = useState(false); // State for "select all" checkbox
    const [articleId, setArticleId] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);

    useEffect(() => {
        setKeywords(initialKeywords);
    }, [initialKeywords]);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Created':
                return '生成済';
            case 'NotStarted':
                return '未作成';
            case 'Draft':
                return '続行する';
            default:
                return status;
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Created':
                return 'bg-[#1dcbde] font-bold text-white';
            case 'NotStarted':
                return 'bg-[#808080] text-white';
            case 'Draft':
                return 'bg-[#FF854F] text-white';
            default:
                return status;
        }
    }

    const getStatusLabelBtn = (status: string) => {
        switch (status) {
            case 'Created':
                return '編集';
            case 'Draft':
                return '続行する';
            case 'NotStarted':
                return '記事生成';
            default:
                return status;
        }
    }

    const handleButtonClick = (keyword: Keyword) => {
        if (keyword.status === 'Created') {
            router.push(`/setting/article-end?articleId=${keyword.articleId}`);
        }
        if (keyword.status === 'NotStarted') {
            setShowCreditModal(true);
            setSelectedKeyword(keyword);
        }
        if (keyword.status === 'Draft') {
            console.log("article  id", keyword.articleId)
            router.push(`/setting?articleId=${keyword.articleId}`);
        }
    }

    const handleGenerateConfirm = async () => {
        setIsLoading(true);

        if (!selectedKeyword) {
            return;
        }

        articleGenerate(selectedKeyword.keyword);
        // try {
        //     const token = localStorage.getItem('token');
        //     if (!token) {
        //         throw new Error('No authentication token found');
        //     }

        //     // const response = await axios.post(
        //     //     `${process.env.NEXT_PUBLIC_API_URL!}/article`,
        //     //     { keyword: selectedKeyword.keyword },
        //     //     {
        //     //         headers: {
        //     //             'Content-Type': 'application/json',
        //     //             'Authorization': `Bearer ${token}`
        //     //         }
        //     //     }
        //     // );

        //     // setArticleId(response.data.id);
        // } catch (error) {
        //     console.error("Failed to generate article:", error);
        // } finally {
        //     setIsLoading(false);
        // }
    }

    const handleGenerateCancel = () => {
        setShowCreditModal(false);
    }

    const articleGenerate = (keyword: string) => {
        router.push(`/setting?keyword=${keyword}`);
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        const newKeywords = keywords.map(keyword =>
            filteredKeywords.includes(keyword)
                ? { ...keyword, selected: newSelectAll }
                : keyword
        );
        setKeywords(newKeywords);
        setKeywordsDL(newKeywords);
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setKeywords(prevKeywords => {
            return [...prevKeywords].sort((a, b) => {
                return newSortOrder === 'asc'
                    ? a.keyword.localeCompare(b.keyword)
                    : b.keyword.localeCompare(a.keyword);
            });
        });
    };

    const handleVolumeSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        setKeywords(prevKeywords => {
            return [...prevKeywords].sort((a, b) => {
                const volumeA = parseInt(a.volume, 10);
                const volumeB = parseInt(b.volume, 10);
                return newSortOrder === 'asc'
                    ? volumeA - volumeB
                    : volumeB - volumeA;
            });
        });
    };

    const toggleStatusDropdown = () => {
        setStatusDropdownVisible(prev => !prev);
    }

    const handleStatusFilter = (status: string | null) => {
        setStatusFilter(status);
        setStatusDropdownVisible(false);
    }

    useEffect(() => {
        const fetchKeywords = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL!}/keyword`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                const sortedKeywords = response.data
                    .map((keyword: Keyword) => ({
                        ...keyword,
                        selected: false,
                        createdAt: keyword.createdAt || new Date(0).toISOString() // Ensure createdAt is always defined
                    }))
                    .sort((a: Keyword, b: Keyword) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                    });

                setKeywords(sortedKeywords);
                setKeywordsDL(sortedKeywords); // Update the parent component's state
            } catch (error) {
                console.error("Failed to fetch keywords:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKeywords();
    }, [setKeywordsDL]);

    const filteredKeywords = keywords.filter(keyword => {
        return (!statusFilter || keyword.status === statusFilter) &&
            keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleDeleteKeyword = async (keywordId: string) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL!}/keyword/${keywordId}`,
                {
                    headers: {
                        'Authentication': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const updatedKeywords = keywords.filter(keyword => keyword.id !== keywordId);
            setKeywords(updatedKeywords);
            setKeywordsDL(updatedKeywords);
        } catch (error) {
            console.error("Failed to delete keyword", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Credit
                show={showCreditModal}
                onConfirm={handleGenerateConfirm}
                onCancel={handleGenerateCancel}
            />
            {/* <Filter onShow={filterShow} /> */}
            <div className="overflow-x-scroll scrollbar-thin relative rounded-xl">
                <table className="min-w-full">
                    <thead className="bg-white text-left p-2">
                        <tr>
                            <th className=" px-8 py-3 font-bold text-gray-900 text-xs text-left w-[4%]">
                                <input
                                    type="checkbox"
                                    id="SelectAll"
                                    className="size-5 rounded border-gray-300"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="whitespace-nowrap px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">キーワード</p>
                                    <IoFilter onClick={handleSort} className="cursor-pointer" />
                                </div>
                            </th>
                            <th className="whitespace-nowrap px-8 py-2">
                                <div className="flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">ボリューム</p>
                                    <IoFilter onClick={handleVolumeSort} className="cursor-pointer" />
                                </div>
                            </th>
                            <th className="whitespace-nowrap px-8 py-2 text-left">
                                <div className="relative flex flex-row gap-3">
                                    <p className="font-bold text-gray-900 text-xs">記事生成ステータス</p>
                                    <IoFilter onClick={toggleStatusDropdown} className="cursor-pointer" />
                                    {statusDropdownVisible && (
                                        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg">
                                            <p onClick={() => handleStatusFilter('Created')} className="px-6 py-1 cursor-pointer text-[12px] text-gray-500 hover:bg-gray-200">生成済</p>
                                            <p onClick={() => handleStatusFilter('NotStarted')} className="px-6 py-1 cursor-pointer text-[12px] text-gray-500 hover:bg-gray-200">未作成</p>
                                            <p onClick={() => handleStatusFilter(null)} className="px-6 py-1 cursor-pointer text-[12px] text-gray-500 hover:bg-gray-200">全て</p>
                                        </div>
                                    )}
                                </div>
                            </th>
                            <th className="whitespace-nowrap py-2 font-bold text-gray-900 text-xs text-left"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-gray-100">
                        {filteredKeywords.length > 0 ? (
                            filteredKeywords.map((keyword) => (
                                <tr key={keyword.id}>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">
                                        <input
                                            type="checkbox"
                                            checked={keyword.selected}
                                            onChange={() => handleKeywordSelection(keyword.id)}
                                            className="size-5 rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{keyword.keyword}</td>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">{keyword.volume}</td>
                                    <td className="whitespace-nowrap px-8 py-2 font-medium text-gray-900 text-[14px]">
                                        <span className={`py-2 px-4 rounded-full ${getStatusStyle(keyword.status)}`}>
                                            {getStatusLabel(keyword.status)}
                                        </span>
                                    </td>
                                    <td className="flex flex-row items-center justify-between whitespace-nowrap gap-4 px-4 py-2 font-medium text-gray-900 text-[14px]">
                                        <Button
                                            className="custom-class"
                                            onClick={() => handleButtonClick(keyword)}
                                            common
                                            icon={FaStar}
                                            label={getStatusLabelBtn(keyword.status)}
                                        />
                                        <RiDeleteBinLine onClick={() => handleDeleteKeyword(keyword.id)} className="cursor-pointer mr-5" size={18} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-500">
                                    表示するデータがありません。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default SavedKw;
