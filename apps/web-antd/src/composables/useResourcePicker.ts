import type { ResourceModel, ResourceType } from '#/types/resource';

import { createVNode, render } from 'vue';

import ResourcePickerModal from '#/components/resource/ResourcePickerModal.vue';

export interface ResourcePickerOptions {
  /**
   * 选择模式：单选 / 多选
   */
  mode?: 'multiple' | 'single';
  /**
   * 接受的资源类型
   */
  acceptTypes?: ResourceType[];
  /**
   * 已选中的资源 IDs（用于回显）
   */
  selectedIds?: number[];
  /**
   * 最大选择数量
   */
  maxSelection?: number;
}

/**
 * 打开资源选择器
 * @param options 配置选项
 * @returns Promise<Resource[]> 返回选中的资源列表
 */
export function openResourcePicker(
  options: ResourcePickerOptions = {},
): Promise<ResourceModel[]> {
  return new Promise((resolve) => {
    // 创建容器
    const container = document.createElement('div');
    document.body.append(container);

    // 清理函数
    const cleanup = () => {
      render(null, container);
      container.remove();
    };

    // 处理确认
    const handleConfirm = (resources: ResourceModel[]) => {
      cleanup();
      resolve(resources);
    };

    // 处理取消
    const handleCancel = () => {
      cleanup();
      resolve([]);
    };

    // 创建组件 VNode
    const vnode = createVNode(ResourcePickerModal, {
      open: true,
      mode: options.mode || 'multiple',
      acceptTypes: options.acceptTypes || [],
      selectedIds: options.selectedIds || [],
      maxSelection: options.maxSelection || 30,
      onConfirm: handleConfirm,
      'onUpdate:open': (open: boolean) => {
        if (!open) {
          handleCancel();
        }
      },
    });

    // 渲染组件
    render(vnode, container);
  });
}

/**
 * 使用资源选择器的 Hook
 */
export function useResourcePicker() {
  return {
    openResourcePicker,
  };
}
