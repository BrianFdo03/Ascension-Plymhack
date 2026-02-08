import { useState } from 'react';
import { Accessibility, X, Type, Sun, Moon, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const AccessibilityPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { fontSize, contrastMode, setFontSize, setContrastMode, resetSettings } = useAccessibility();

    const handleFontIncrease = () => {
        const newSize = Math.min(fontSize + 10, 150);
        setFontSize(newSize);
    };

    const handleFontDecrease = () => {
        const newSize = Math.max(fontSize - 10, 80);
        setFontSize(newSize);
    };

    const handleReset = () => {
        resetSettings();
    };

    return (
        <>
            {/* Floating Accessibility Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all hover:scale-110 animate-pulse hover:animate-none"
                aria-label="Accessibility Options"
            >
                <Accessibility size={28} />
            </button>

            {/* Accessibility Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Panel */}
                    <div className="fixed bottom-28 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Accessibility size={22} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Accessibility</h3>
                                        <p className="text-xs text-purple-100">Customize your experience</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-6 max-h-[500px] overflow-y-auto">
                            {/* Font Size Control */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Type size={18} className="text-purple-600" />
                                    </div>
                                    <span className="font-bold text-gray-900">Text Size</span>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <button
                                        onClick={handleFontDecrease}
                                        disabled={fontSize <= 80}
                                        className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow"
                                    >
                                        <ZoomOut size={20} />
                                    </button>
                                    <div className="flex-1 text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{fontSize}%</div>
                                        <div className="text-xs text-gray-500 mt-1">Default: 100%</div>
                                    </div>
                                    <button
                                        onClick={handleFontIncrease}
                                        disabled={fontSize >= 150}
                                        className="p-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow"
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                </div>
                                <input
                                    type="range"
                                    min="80"
                                    max="150"
                                    step="10"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                            </div>

                            {/* Contrast/Theme Control */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Sun size={18} className="text-blue-600" />
                                    </div>
                                    <span className="font-bold text-gray-900">Display Mode</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setContrastMode('normal')}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            contrastMode === 'normal'
                                                ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow'
                                        }`}
                                    >
                                        <Sun size={24} className="mx-auto mb-2 text-yellow-500" />
                                        <div className="text-xs font-bold text-gray-900">Normal</div>
                                        <div className="text-xs text-gray-500 mt-1">Standard</div>
                                    </button>
                                    <button
                                        onClick={() => setContrastMode('high')}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            contrastMode === 'high'
                                                ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow'
                                        }`}
                                    >
                                        <Sun size={24} className="mx-auto mb-2 text-orange-500" />
                                        <div className="text-xs font-bold text-gray-900">High</div>
                                        <div className="text-xs text-gray-500 mt-1">Contrast</div>
                                    </button>
                                    <button
                                        onClick={() => setContrastMode('dark')}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            contrastMode === 'dark'
                                                ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow'
                                        }`}
                                    >
                                        <Moon size={24} className="mx-auto mb-2 text-blue-600" />
                                        <div className="text-xs font-bold text-gray-900">Dark</div>
                                        <div className="text-xs text-gray-500 mt-1">Mode</div>
                                    </button>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                                <div className="text-xs font-semibold text-purple-900 mb-2">Preview</div>
                                <div className="text-sm text-gray-700">
                                    This is how text will appear with your current settings.
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={handleReset}
                                className="w-full flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold rounded-xl transition-all shadow-sm hover:shadow"
                            >
                                <RotateCcw size={20} />
                                Reset to Default
                            </button>

                            {/* Info */}
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                                <div className="flex items-start gap-3">
                                    <Accessibility size={20} className="text-purple-600 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold text-purple-900 mb-1">Accessibility Features</div>
                                        <p className="text-xs text-purple-700">
                                            These settings improve readability and visibility. Changes apply to all pages instantly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default AccessibilityPanel;
