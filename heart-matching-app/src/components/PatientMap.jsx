import React, { useState, useRef, useEffect } from 'react';
import { usePatients } from '../hooks/usePatients';

const PatientMap = ({ onPatientSelect }) => {
  const { patients } = usePatients();
  const [hoveredPatient, setHoveredPatient] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  // エリア情報（簡易的な東京エリア）
  const [areas, setAreas] = useState([
    {
      id: 'sumida',
      name: '墨田区エリア',
      color: '#3B82F6',
      center: { x: 150, y: 120 },
      radius: 85,
      patientCount: 0
    },
    {
      id: 'koto',
      name: '江東区エリア',
      color: '#10B981',
      center: { x: 320, y: 220 },
      radius: 80,
      patientCount: 0
    },
    {
      id: 'edogawa',
      name: '江戸川区エリア',
      color: '#F59E0B',
      center: { x: 500, y: 150 },
      radius: 75,
      patientCount: 0
    }
  ]);

  // 患者データが変更された時にエリアの患者数を更新
  useEffect(() => {
    setAreas(prevAreas => prevAreas.map(area => ({
      ...area,
      patientCount: patients.filter(p => p.area.includes(area.name.split('エリア')[0])).length
    })));
  }, [patients]);

  // 患者の位置を計算（エリア内にランダム配置）
  const getPatientPosition = (patient, existingPositions = []) => {
    const area = areas.find(a => patient.area.includes(a.name.split('区')[0] + '区'));
    if (!area) return { x: 100, y: 100 };

    // 既存のピンとの距離を確保するための試行回数
    let attempts = 0;
    let position;
    
    do {
      // エリア中心から半径内にランダム配置（より中心寄りに）
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * (area.radius - 30) + 15; // 境界から少し離す
      const x = area.center.x + Math.cos(angle) * distance;
      const y = area.center.y + Math.sin(angle) * distance;
      
      position = { x, y };
      attempts++;
      
      // 既存のピンとの距離をチェック（最低25px離す）
      const tooClose = existingPositions.some(existing => {
        const distance = Math.sqrt((existing.x - x) ** 2 + (existing.y - y) ** 2);
        return distance < 25;
      });
      
      if (!tooClose || attempts > 50) break; // 50回試行して無理なら諦める
      
    } while (attempts < 50);
    
    return position;
  };

  // 患者位置を計算してキャッシュ
  const [patientPositions, setPatientPositions] = useState({});

  // 患者データが変更された時に位置を再計算
  useEffect(() => {
    const positions = {};
    const existingPositions = [];
    
    patients.forEach(patient => {
      const position = getPatientPosition(patient, existingPositions);
      positions[patient.id] = position;
      existingPositions.push(position);
    });
    
    setPatientPositions(positions);
  }, [patients]);

  const handleMouseMove = (e) => {
    if (hoveredPatient && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left + 10,
        y: e.clientY - rect.top - 10
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10B981'; // 緑
      case 'pending': return '#F59E0B';   // オレンジ
      case 'accepted': return '#3B82F6';  // 青
      case 'rejected': return '#EF4444';  // 赤
      default: return '#6B7280';          // グレー
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return '募集中';
      case 'pending': return '審査中';
      case 'accepted': return '受入決定';
      case 'rejected': return '受入不可';
      default: return '不明';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">患者マップ</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            募集中
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            審査中
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            受入決定
          </div>
        </div>
      </div>

      <div className="relative border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
        <svg
          ref={mapRef}
          width="100%"
          height="400"
          viewBox="0 0 600 400"
          onMouseMove={handleMouseMove}
          className="cursor-pointer"
        >
          {/* 背景 */}
          <rect width="600" height="400" fill="#F9FAFB" />
          
          {/* エリア表示 */}
          {areas.map(area => (
            <g key={area.id}>
              {/* エリア円 */}
              <circle
                cx={area.center.x}
                cy={area.center.y}
                r={area.radius}
                fill={area.color}
                fillOpacity="0.1"
                stroke={area.color}
                strokeWidth="2"
                strokeDasharray="5,5"
                className={`cursor-pointer transition-all duration-200 ${
                  selectedArea === area.id ? 'fill-opacity-20' : 'hover:fill-opacity-15'
                }`}
                onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
              />
              
              {/* エリア名 */}
              <text
                x={area.center.x}
                y={area.center.y - area.radius - 10}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-700"
              >
                {area.name}
              </text>
              
              {/* 患者数表示 */}
              <circle
                cx={area.center.x}
                cy={area.center.y - area.radius + 15}
                r="12"
                fill={area.color}
                className="opacity-90"
              />
              <text
                x={area.center.x}
                y={area.center.y - area.radius + 20}
                textAnchor="middle"
                className="text-xs font-bold fill-white"
              >
                {area.patientCount}
              </text>
            </g>
          ))}

          {/* 患者ピン */}
          {patients.map(patient => {
            const position = patientPositions[patient.id];
            
            // 位置が計算されていない場合はスキップ
            if (!position) return null;
            
            const isHovered = hoveredPatient?.id === patient.id;
            const isInSelectedArea = selectedArea ? 
              patient.area.includes(areas.find(a => a.id === selectedArea)?.name.split('区')[0] + '区') : true;

            if (!isInSelectedArea) return null;

            return (
              <g key={patient.id}>
                {/* ピンの影 */}
                <g transform={`translate(${position.x + 2}, ${position.y + 2})`} opacity="0.3">
                  {/* ヒト型シルエット（影） */}
                  <circle cx="0" cy="-12" r="6" fill="black" />
                  <rect x="-3" y="-6" width="6" height="9" fill="black" />
                  <rect x="-2" y="3" width="1.5" height="6" fill="black" />
                  <rect x="0.5" y="3" width="1.5" height="6" fill="black" />
                </g>
                
                {/* ピン本体 - ヒト型 */}
                <g 
                  transform={`translate(${position.x}, ${position.y}) scale(${isHovered ? 1.3 : 1.15})`}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => {
                    if (hoveredPatient?.id !== patient.id) {
                      setHoveredPatient(patient);
                    }
                  }}
                  onMouseLeave={(e) => {
                    // マウスがツールチップに移動していない場合のみクリア
                    const rect = mapRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // 患者ピンから十分離れた場合のみクリア
                    const distance = Math.sqrt((x - position.x) ** 2 + (y - position.y) ** 2);
                    if (distance > 25) {
                      setTimeout(() => setHoveredPatient(null), 100);
                    }
                  }}
                  onClick={() => onPatientSelect && onPatientSelect(patient)}
                >
                  {/* 頭部 */}
                  <circle 
                    cx="0" 
                    cy="-12" 
                    r="6" 
                    fill={getStatusColor(patient.status)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  
                  {/* 胴体 */}
                  <rect 
                    x="-3" 
                    y="-6" 
                    width="6" 
                    height="9" 
                    fill={getStatusColor(patient.status)}
                    stroke="white"
                    strokeWidth="2"
                    rx="1.5"
                  />
                  
                  {/* 左脚 */}
                  <rect 
                    x="-2" 
                    y="3" 
                    width="1.5" 
                    height="6" 
                    fill={getStatusColor(patient.status)}
                    stroke="white"
                    strokeWidth="1.5"
                    rx="0.8"
                  />
                  
                  {/* 右脚 */}
                  <rect 
                    x="0.5" 
                    y="3" 
                    width="1.5" 
                    height="6" 
                    fill={getStatusColor(patient.status)}
                    stroke="white"
                    strokeWidth="1.5"
                    rx="0.8"
                  />
                  
                  {/* 左腕 */}
                  <rect 
                    x="-4.5" 
                    y="-3" 
                    width="1.5" 
                    height="4.5" 
                    fill={getStatusColor(patient.status)}
                    stroke="white"
                    strokeWidth="1"
                    rx="0.8"
                  />
                  
                  {/* 右腕 */}
                  <rect 
                    x="3" 
                    y="-3" 
                    width="1.5" 
                    height="4.5" 
                    fill={getStatusColor(patient.status)}
                    stroke="white"
                    strokeWidth="1"
                    rx="0.8"
                  />
                </g>

                {/* ホバー時の拡大リング */}
                {isHovered && (
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="20"
                    fill="none"
                    stroke={getStatusColor(patient.status)}
                    strokeWidth="2"
                    strokeOpacity="0.5"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* ホバー時のツールチップ */}
        {hoveredPatient && (
          <div
            className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs pointer-events-none"
            style={{
              left: `${Math.min(tooltipPosition.x, 500)}px`,
              top: `${Math.max(tooltipPosition.y, 10)}px`,
              transform: tooltipPosition.x > 300 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="text-sm">
              <div className="font-semibold text-gray-900 mb-2">
                患者ID: {hoveredPatient.id}
              </div>
              <div className="text-gray-600 space-y-1">
                <div className="flex items-center">
                  <span className="font-medium mr-1">年齢・性別:</span>
                  {hoveredPatient.ageGroup}・{hoveredPatient.gender}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">診断:</span>
                  {hoveredPatient.diagnosis}
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">NYHA:</span>
                  Class {hoveredPatient.nyhaClass}
                </div>
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getStatusColor(hoveredPatient.status) }}
                  ></div>
                  <span className="font-medium">{getStatusText(hoveredPatient.status)}</span>
                </div>
                <div className="text-xs text-blue-600 mt-2 font-medium">
                  👆 クリックで詳細を表示
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 選択されたエリアの情報 */}
      {selectedArea && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            {areas.find(a => a.id === selectedArea)?.name} の詳細
          </h3>
          <div className="text-sm text-blue-800">
            <div>患者数: {areas.find(a => a.id === selectedArea)?.patientCount}名</div>
            <div className="mt-1">
              募集中: {patients.filter(p => 
                p.area.includes(areas.find(a => a.id === selectedArea)?.name.split('区')[0] + '区') && 
                p.status === 'available'
              ).length}名
            </div>
          </div>
        </div>
      )}

      {/* 操作説明 */}
      <div className="mt-4 text-xs text-gray-500">
        <div>• エリア円をクリックして絞り込み表示</div>
        <div>• 患者ピンにホバーで概要表示</div>
        <div>• 患者ピンをクリックで詳細ページへ</div>
      </div>
    </div>
  );
};

export default PatientMap;