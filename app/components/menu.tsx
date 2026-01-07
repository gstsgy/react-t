import { useNavigate } from "react-router";
import { Flex, Layout, Button, theme, Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { getIconByName } from "@/utils/iconRegistry";




export default function MyMenu({ menus }) {
  const reactMenus = menus.map((item) => ({
    key: item.id,
    label: item.name,
   // icon: item.icon,
    children: item.children.map((it) => ({
      key: it.id,
      label: it.name,
    })),
  }));
  interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
  }
  
  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  
  const levelKeys = getLevelKeys(reactMenus as LevelKeysProps[]);

  let navigate = useNavigate();
  const [stateOpenKeys, setStateOpenKeys] = useState([]);

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => !stateOpenKeys.includes(key));
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  function goto1({ key, keyPath, domEvent }) {
    if (key === "11") {
      navigate("/");
    } else if (key === "12") {
      navigate("/test");
    }
    console.log(key, keyPath);
  }

  return (
    <Menu
      style={{height:'100%'}}
      mode="inline"
      theme="dark"
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      items={reactMenus}
      onClick={goto1}
    />
  );
}
