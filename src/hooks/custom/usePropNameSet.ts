export const usePropNameSet = () => {
  /** 遍历树设置treeSelect所需值*/
  const mapTreeSetPropName = (
    org,
    propMapping = { labelName: 'name', valueName: 'id', childrenName: 'children' },
  ) => {
    const haveChildren =
      Array.isArray(org[propMapping.childrenName]) && org[propMapping.childrenName].length > 0;
    return {
      label: org[propMapping.labelName],
      value: org[propMapping.valueName],
      children: haveChildren
        ? org[propMapping.childrenName].map((i) => mapTreeSetPropName(i, propMapping))
        : null,
    };
  };

  /**
   * @description 遍历树并设置属性: const newTree = formatTree(tree, 'key', 'label')
   * @param tree any[]
   * @param keyField 需要转化的value属性名
   * @param labelField 需要转化的label属性名
   */
  const formatTree = (tree, keyField, labelField) => {
    const dfs = (treeData, key, label) => {
      for (const node of treeData) {
        node.value = node[key];
        node.label = node[label];
        if (node.children && node.children.length) {
          dfs(node.children, key, label);
        }
      }
      return tree;
    };
    return dfs(tree, keyField, labelField);
  };

  /** 设置对象属性名*/
  const propNameSet = (sourceObj, propNameMappings = {}) => {
    const propNames = Object.keys(propNameMappings);
    const propNamesNew = Object.values(propNameMappings);
    if (!propNames.length) return;
    const target = {};
    for (const key in sourceObj) {
      if (Object.prototype.hasOwnProperty.call(sourceObj, key)) {
        const item = sourceObj[key];
        if (propNames.includes(key)) {
          const keyIndex = propNames.findIndex((item) => item === key);
          target[(propNamesNew as any[])[keyIndex]] = item;
        } else {
          target[key] = item;
        }
      }
    }
    return target;
  };

  /**
   * @description 查找包含自身节点的父代节点
   * @param tree 需要查找的树数据
   * @param curKey 当前节点key
   * @param keyField 自定义 key 字段
   * @param node 找到的node 可以不传
   */
  const findCurNode = (tree, curKey, keyField, node = null) => {
    const stack = [] as any[];
    for (const item of tree) {
      if (item) {
        stack.push(item);
        while (stack.length) {
          const temp = stack.pop();
          if (temp[keyField] === curKey) {
            node = temp;
            break;
          }
          const children = temp.children || [];
          for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
          }
        }
      }
    }
    return node;
  };

  /** 遍历树，给本身及子代添加 disabled 属性*/
  const formatTreeSetDisabled = (tree, disabledField = 'disabled') => {
    const dfs = (treeData, disabledField) => {
      for (const node of treeData) {
        node[disabledField] = true;
        if (node.children && node.children.length) {
          dfs(node.children, disabledField);
        }
      }
      return tree;
    };
    return dfs(tree, disabledField);
  };

  /**
   * @description 查找包含自身节点及子节点并添加disabled属性
   * @param tree 需要查找的树数据
   * @param curKey 当前节点key
   * @param keyField 自定义 key 字段
   * @param node 找到的node 可以不传
   */
  const findCurNodeAndSetDisabled = (tree, curKey, keyField, node = null) => {
    const stack = [] as any[];
    for (const item of tree) {
      if (item) {
        stack.push(item);
        while (stack.length) {
          const temp = stack.pop();
          if (temp[keyField] === curKey) {
            // 找到当前节点 -> 添加属性
            formatTreeSetDisabled([temp], 'disabled');
            node = temp;
            break;
          }
          const children = temp.children || [];
          for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
          }
        }
      }
    }
    return node;
  };

  return {
    mapTreeSetPropName,
    propNameSet,
    formatTree,
    findCurNode,
    findCurNodeAndSetDisabled,
  };
};
