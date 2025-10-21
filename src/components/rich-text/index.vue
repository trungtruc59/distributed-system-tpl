<template>
  <div class="rich-text-editor">
    <QuillEditor
      v-model:content="content"
      :options="editorOptions"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      content-type="html"
      @update:content="handleContentChange"
      @ready="handleReady"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';

  interface Props {
    modelValue?: string;
    placeholder?: string;
    readonly?: boolean;
    disabled?: boolean;
    height?: string | number;
    toolbar?: string[] | 'full' | 'minimal';
    theme?: 'snow' | 'bubble';
    name?: string; // Để tích hợp với form
    required?: boolean; // Để validation
    error?: string; // Hiển thị lỗi
  }

  interface Emits {
    (e: 'update:modelValue', value: string): void;
    (e: 'change', value: string): void; // Sự kiện onChange
    (e: 'ready', quill: any): void;
    (e: 'focus', event: any): void;
    (e: 'blur', event: any): void;
    (e: 'input', event: any): void; // Cho form validation
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: 'Nhập nội dung...',
    readonly: false,
    disabled: false,
    height: '200px',
    toolbar: 'full',
    theme: 'snow',
    name: '',
    required: false,
    error: '',
  });

  const emit = defineEmits<Emits>();

  const quillInstance = ref<any>(null);

  // Cấu hình toolbar mặc định
  const defaultToolbar = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ];

  const minimalToolbar = [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ];

  // Computed property để tránh mutation prop
  const content = computed({
    get: () => props.modelValue || '',
    set: (value: string) => emit('update:modelValue', value),
  });

  const editorOptions = computed(() => {
    let toolbarConfig = defaultToolbar;

    if (props.toolbar === 'minimal') {
      toolbarConfig = minimalToolbar;
    } else if (Array.isArray(props.toolbar)) {
      toolbarConfig = props.toolbar;
    }

    return {
      theme: props.theme,
      modules: {
        toolbar: toolbarConfig,
      },
      placeholder: props.placeholder,
      readOnly: props.readonly,
    };
  });

  const handleContentChange = (newContent: string) => {
    emit('update:modelValue', newContent);
    emit('change', newContent); // Sự kiện onChange
    emit('input', { target: { value: newContent, name: props.name } }); // Cho form validation
  };

  const handleReady = (quill: any) => {
    quillInstance.value = quill;
    emit('ready', quill);
  };

  const handleFocus = (event: any) => {
    emit('focus', event);
  };

  const handleBlur = (event: any) => {
    emit('blur', event);
  };

  // Expose methods for parent component
  const getQuillInstance = () => quillInstance.value;

  const insertText = (text: string) => {
    if (quillInstance.value) {
      const range = quillInstance.value.getSelection();
      quillInstance.value.insertText(range?.index || 0, text);
    }
  };

  const insertHTML = (html: string) => {
    if (quillInstance.value) {
      const range = quillInstance.value.getSelection();
      quillInstance.value.clipboard.dangerouslyPasteHTML(
        range?.index || 0,
        html
      );
    }
  };

  const getText = () => {
    return quillInstance.value?.getText() || '';
  };

  const getHTML = () => {
    return quillInstance.value?.root.innerHTML || '';
  };

  const clear = () => {
    if (quillInstance.value) {
      quillInstance.value.setText('');
    }
  };

  const focus = () => {
    if (quillInstance.value) {
      quillInstance.value.focus();
    }
  };

  const blur = () => {
    if (quillInstance.value) {
      quillInstance.value.blur();
    }
  };

  // Expose methods
  defineExpose({
    getQuillInstance,
    insertText,
    insertHTML,
    getText,
    getHTML,
    clear,
    focus,
    blur,
  });
</script>

<style scoped>
  .rich-text-editor {
    width: 100%;
  }

  .rich-text-editor :deep(.ql-editor) {
    min-height: v-bind(height);
    font-family: inherit;
  }

  .rich-text-editor :deep(.ql-toolbar) {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .rich-text-editor :deep(.ql-container) {
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .rich-text-editor :deep(.ql-editor.ql-blank::before) {
    font-style: normal;
    color: #999;
  }

  .error-message {
    color: #f53f3f;
    font-size: 12px;
    margin-top: 4px;
    line-height: 1.5;
  }
</style>
