<script setup lang="ts">
import type { ResourceFolderModel } from '#/types/resource';

import { ref, watch } from 'vue';

import { message, Modal } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import {
  createResourceFolder,
  updateResourceFolder,
} from '#/api/resource/resource';

interface Props {
  open: boolean;
  editData?: ResourceFolderModel;
  parentId?: number;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 是否编辑模式
const isEdit = ref(false);

// 表单配置
const [FolderForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入目录名称',
      },
      fieldName: 'name',
      label: '目录名称',
      rules: z.string().min(1, '目录名称不能为空'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入目录描述',
        rows: 3,
      },
      fieldName: 'description',
      label: '目录描述',
    },
  ],
  showDefaultActions: false,
});

// 提交表单
const handleConfirm = async () => {
  const { valid } = await formApi.validate();
  if (!valid) return;

  const values = await formApi.getValues();

  try {
    if (isEdit.value && props.editData) {
      await updateResourceFolder(props.editData.id, values);
      message.success('更新目录成功');
    } else {
      const data: any = { ...values };
      if (props.parentId !== undefined) {
        data.parent_id = props.parentId;
      }
      await createResourceFolder(data);
      message.success('创建目录成功');
    }
    emit('success');
    handleCancel();
  } catch (error) {
    console.error('操作失败:', error);
    message.error('操作失败');
  }
};

// 取消
const handleCancel = () => {
  emit('update:open', false);
  formApi.resetForm();
};

// 监听弹窗打开
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      isEdit.value = !!props.editData;
      if (props.editData) {
        formApi.setValues({
          name: props.editData.name,
        });
      } else {
        formApi.resetForm();
      }
    }
  },
);
</script>

<template>
  <Modal
    :open="open"
    :title="isEdit ? '编辑目录' : '创建目录'"
    @cancel="handleCancel"
    @ok="handleConfirm"
  >
    <div class="py-4">
      <FolderForm />
    </div>
  </Modal>
</template>
