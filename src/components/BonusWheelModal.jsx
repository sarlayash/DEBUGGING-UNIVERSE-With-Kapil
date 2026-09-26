import React, { useState, useRef } from 'react';
import { X, Disc3, Sparkles, Award, Shield, CheckCircle, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { recordWheelSpin, updateScore } from '../utils/storage';

const WHEEL_SECTORS = [
  { label: '+100 Bonus IQ Points', reward: '100_IQ', color: '#0f172a', textColor: '#ffffff', xp: 100 },
  { label: 'Streak Freeze Shield', reward: 'STREAK_FREEZE', color: '#334155', textColor: '#ffffff' },
  { label: 'Free Hint Pass (No Penalty)', reward: 'FREE_HINT', color: '#475569', textColor: '#ffffff' },
  { label: 'Double XP 24hr Booster', reward: 'DOUBLE_XP', color: '#0f172a', textColor: '#ffffff' },
  { label: 'Unlock Kapil Secret Bug Challenge', reward: 'SECRET_CHALLENGE', color: '#1e293b', textColor: '#ffffff' },
  { label: '+50 Bonus IQ Points', reward: '50_IQ', color: '#64748b', textColor: '#ffffff', xp: 50 },
  { label: 'Anti-Negative Marking Token', reward: 'SHIELD_TOKEN', color: '#0f172a', textColor: '#ffffff' },
  { label: '+150 Bonus IQ Points', reward: '150_IQ', color: '#1e293b', textColor: '#ffffff', xp: 150 },
];

export default function BonusWheelModal({ isOpen, onClose, onRewardEarned }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);

  if (!isOpen) return null;

  const numSectors = WHEEL_SECTORS.length;
  const sectorAngle = 360 / numSectors;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonReward(null);

    // Calculate random landing sector
    const winningIndex = Math.floor(Math.random() * numSectors);
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full 360 spins
    const targetAngle = extraSpins * 360 + (360 - (winningIndex * sectorAngle) - (sectorAngle / 2));

    const finalRotation = rotation + targetAngle;
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const selected = WHEEL_SECTORS[winningIndex];
      setWonReward(selected);
      setHasSpun(true);

      // Award XP if applicable
      if (selected.xp) {
        updateScore(selected.xp);
      }
      recordWheelSpin(selected.label);

      // Launch Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onRewardEarned) {
        onRewardEarned(selected);
      }
    }, 4500); // 4.5 seconds spin duration
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-center relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Gift size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Fortune 500 Bonus Wheel
              </h3>
              <p className="text-[11px] text-slate-500">
                DEBUGGING UNIVERSE &bull; Powered By SarlaYash Mission
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Wheel Body */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-xs text-slate-600 mb-6 max-w-sm">
            Spin to earn daily rewards: <strong>Bonus Debugging IQ</strong>, <strong>Streak Freezes</strong>, and <strong>Negative Marking Protection Tokens</strong>!
          </p>

          {/* Wheel Container with Pointer */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6">
            {/* Top Pointer Needle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-500 filter drop-shadow-md"></div>

            {/* Rotating SVG Wheel */}
            <div 
              className="w-full h-full rounded-full border-4 border-slate-900 shadow-xl overflow-hidden transition-transform ease-out"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionDuration: isSpinning ? '4.5s' : '0s',
                transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.2, 1)'
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {WHEEL_SECTORS.map((sector, idx) => {
                  const angle = 360 / numSectors;
                  const startAngle = idx * angle;
                  const endAngle = startAngle + angle;
                  
                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                  const textAngle = startAngle + angle / 2;

                  return (
                    <g key={idx}>
                      <path 
                        d={pathData} 
                        fill={sector.color} 
                        stroke="#e2e8f0" 
                        strokeWidth="0.5" 
                      />
                      {/* Short label indicator */}
                      <text
                        x="50"
                        y="22"
                        transform={`rotate(${textAngle + 90} 50 50)`}
                        fill={sector.textColor}
                        fontSize="3.2"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="select-none"
                      >
                        {sector.label.length > 15 ? sector.label.substring(0, 14) + '...' : sector.label}
                      </text>
                    </g>
                  );
                })}
                {/* Center Cap */}
                <circle cx="50" cy="50" r="12" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
                <text x="50" y="52" fill="#0f172a" fontSize="4.5" fontWeight="900" textAnchor="middle">
                  KAPIL
                </text>
              </svg>
            </div>
          </div>

          {/* Reward Display */}
          {wonReward && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-1.5 font-bold mb-0.5">
                <CheckCircle size={15} className="text-emerald-600" />
                <span>Congratulations! You Unlocked:</span>
              </div>
              <p className="font-extrabold text-sm text-slate-900 mt-1">
                {wonReward.label}
              </p>
              {wonReward.xp && (
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  +{wonReward.xp} Points credited to your verified profile!
                </div>
              )}
            </div>
          )}

          {/* Spin Action Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full max-w-xs py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Disc3 size={16} className={isSpinning ? 'animate-spin' : ''} />
            {isSpinning ? 'Spinning The Universe...' : (hasSpun ? 'Spin Again!' : 'Spin The Wheel Now')}
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500">
          Powered By SarlaYash Mission &bull; Bonuses credited directly to Kapil's verified ledger
        </div>
      </div>
    </div>
  );
}
