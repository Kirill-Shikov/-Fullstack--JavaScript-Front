import { useState, useEffect, useRef } from 'react';
import { UserProfile, updateProfile, uploadAvatar } from '../api/profile.api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Расширяем интерфейс для пароля
interface UpdateProfileData extends Partial<UserProfile> {
    password?: string;
    contactPhone?: string;
}

interface UseProfileTabReturn {
    formData: {
        name: string;
        email: string;
        phone: string;
        password: string;
    };
    loading: boolean;
    avatarLoading: boolean;
    message: { type: 'success' | 'error' | 'info'; text: string } | null;
    tempAvatar: string | null;
    isAvatarChanged: boolean;
    displayAvatar: string | null;
    hasAvatar: boolean;
    fileInputRef: React.RefObject<HTMLInputElement>;
    handleChange: (field: string, value: string) => void;
    handlePhoneChange: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDeleteTempAvatar: () => void;
    handleUploadClick: () => void;
}

export const useProfileTab = (user: UserProfile | null, onUpdate?: () => void): UseProfileTabReturn => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tempAvatar, setTempAvatar] = useState<string | null>(null);
    const [isAvatarChanged, setIsAvatarChanged] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.contactPhone || '',
                password: '',
            });
            setTempAvatar(null);
            setIsAvatarChanged(false);
        }
    }, [user]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setMessage(null);
    };

    const handlePhoneChange = (value: string) => {
        const onlyDigits = value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, phone: onlyDigits }));
        setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const updateData: UpdateProfileData = {};
            
            if (formData.name !== user?.name) updateData.name = formData.name;
            // ✅ ИСПРАВЛЕНО: contactPhone вместо phone
            if (formData.phone !== user?.contactPhone) updateData.contactPhone = formData.phone;
            if (formData.email !== user?.email) updateData.email = formData.email;
            if (formData.password) {
                updateData.password = formData.password;
            }
            
            if (Object.keys(updateData).length === 0 && !isAvatarChanged) {
                setMessage({ type: 'info', text: 'Нет изменений для сохранения' });
                setLoading(false);
                return;
            }

            await updateProfile(updateData);
            
            setMessage({ type: 'success', text: 'Профиль успешно обновлен!' });
            
            if (onUpdate) {
                onUpdate();
            }
            
            setFormData(prev => ({ ...prev, password: '' }));
            setTempAvatar(null);
            setIsAvatarChanged(false);
        } catch (err: any) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Ошибка обновления профиля' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Пожалуйста, выберите изображение' });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Размер файла не должен превышать 5MB' });
            return;
        }

        setAvatarLoading(true);
        setMessage(null);

        try {
            const result = await uploadAvatar(file);
            setTempAvatar(result.avatar);
            setIsAvatarChanged(true);
            setMessage({ type: 'success', text: 'Аватар загружен! Нажмите "Сохранить изменения" чтобы применить.' });
        } catch (err: any) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Ошибка загрузки аватара' 
            });
        } finally {
            setAvatarLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteTempAvatar = () => {
        setTempAvatar(null);
        setIsAvatarChanged(false);
        setMessage({ type: 'info', text: 'Файл удален. Выберите другой файл или сохраните изменения.' });
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const displayAvatar = tempAvatar !== null ? tempAvatar : user?.avatar || null;
    const hasAvatar = displayAvatar !== null && displayAvatar !== '';

    return {
        formData,
        loading,
        avatarLoading,
        message,
        tempAvatar,
        isAvatarChanged,
        displayAvatar,
        hasAvatar,
        fileInputRef,
        handleChange,
        handlePhoneChange,
        handleSubmit,
        handleAvatarUpload,
        handleDeleteTempAvatar,
        handleUploadClick,
    };
};