// utils/iconRegistry.ts
import * as Icons from '@ant-design/icons';

// 自动收集所有图标
const iconRegistry: Record<string, React.ComponentType<any>> = {};

// 遍历 Icons 对象的所有属性
Object.keys(Icons).forEach(key => {
  // 只导出有效的 React 组件（排除工具函数等）
  if (key.endsWith('Outlined') || 
      key.endsWith('Filled') || 
      key.endsWith('TwoTone') ||
      key.includes('Icon') ||
      /^[A-Z]/.test(key)) { // 以大写字母开头的组件
    const Component = (Icons as any)[key];
    if (Component && typeof Component === 'function') {
      iconRegistry[key] = Component;
    }
  }
});

console.log(`已注册 ${Object.keys(iconRegistry).length} 个图标`);

// 动态图标组件
import React from 'react';

interface DynamicIconProps {
  name: string;
  [key: string]: any;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = iconRegistry[name];
  
  if (!IconComponent) {
    console.warn(`图标 "${name}" 未找到，可用图标：`, Object.keys(iconRegistry).slice(0, 10));
    return null;
  }
  
  return React.createElement(IconComponent, props);
};

// 工具函数
export const getIconByName = (name: string) => iconRegistry[name];