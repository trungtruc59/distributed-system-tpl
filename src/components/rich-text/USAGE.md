# Cách sử dụng Rich Text Editor với Form và onChange

## 1. Sử dụng cơ bản với onChange

```vue
<template>
  <div>
    <RichTextEditor
      v-model="content"
      placeholder="Nhập nội dung bài viết..."
      @change="handleContentChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <p>Nội dung hiện tại: {{ content }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RichTextEditor from '@/components/rich-text/index.vue';

const content = ref('<p>Nội dung mặc định</p>');

const handleContentChange = (newContent) => {
  console.log('Nội dung đã thay đổi:', newContent);
  // Xử lý logic khi nội dung thay đổi
};

const handleFocus = () => {
  console.log('Editor được focus');
};

const handleBlur = () => {
  console.log('Editor mất focus');
};
</script>
```

## 2. Tích hợp với Form Validation

```vue
<template>
  <a-form :model="formData" :rules="rules" @submit="handleSubmit">
    <a-form-item label="Tiêu đề" field="title">
      <a-input v-model="formData.title" placeholder="Nhập tiêu đề" />
    </a-form-item>
    
    <a-form-item label="Nội dung" field="content">
      <RichTextEditor
        v-model="formData.content"
        name="content"
        :required="true"
        :error="formErrors.content"
        placeholder="Nhập nội dung bài viết..."
        @change="handleContentChange"
        @input="handleInput"
      />
    </a-form-item>
    
    <a-form-item>
      <a-button type="primary" html-type="submit">Lưu</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import RichTextEditor from '@/components/rich-text/index.vue';

const formData = reactive({
  title: '',
  content: '',
});

const formErrors = reactive({
  content: '',
});

const rules = {
  title: [
    { required: true, message: 'Vui lòng nhập tiêu đề' },
  ],
  content: [
    { required: true, message: 'Vui lòng nhập nội dung' },
    { 
      validator: (value) => {
        // Loại bỏ HTML tags để kiểm tra độ dài text
        const textContent = value.replace(/<[^>]*>/g, '');
        return textContent.length >= 10;
      }, 
      message: 'Nội dung phải có ít nhất 10 ký tự' 
    },
  ],
};

const handleContentChange = (newContent) => {
  console.log('Nội dung thay đổi:', newContent);
  // Clear error khi user đang nhập
  if (formErrors.content) {
    formErrors.content = '';
  }
};

const handleInput = (event) => {
  // Event này tương thích với form validation
  console.log('Input event:', event);
};

const handleSubmit = (data) => {
  console.log('Form data:', data);
  // Xử lý submit form
};
</script>
```

## 3. Sử dụng với Composition API và Validation tùy chỉnh

```vue
<template>
  <div>
    <RichTextEditor
      ref="editorRef"
      v-model="article.content"
      :height="400"
      toolbar="full"
      @change="validateContent"
      @ready="onEditorReady"
    />
    
    <div v-if="validationError" class="validation-error">
      {{ validationError }}
    </div>
    
    <div class="editor-stats">
      <p>Số từ: {{ wordCount }}</p>
      <p>Số ký tự: {{ charCount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import RichTextEditor from '@/components/rich-text/index.vue';

const editorRef = ref();
const article = ref({
  content: '',
});

const validationError = ref('');

// Computed để đếm từ và ký tự
const wordCount = computed(() => {
  const text = article.value.content.replace(/<[^>]*>/g, '');
  return text.trim() ? text.trim().split(/\s+/).length : 0;
});

const charCount = computed(() => {
  const text = article.value.content.replace(/<[^>]*>/g, '');
  return text.length;
});

// Watch để validate khi content thay đổi
watch(() => article.value.content, (newContent) => {
  validateContent(newContent);
});

const validateContent = (content) => {
  const textContent = content.replace(/<[^>]*>/g, '');
  
  if (!textContent.trim()) {
    validationError.value = 'Nội dung không được để trống';
  } else if (textContent.length < 50) {
    validationError.value = 'Nội dung phải có ít nhất 50 ký tự';
  } else if (textContent.length > 5000) {
    validationError.value = 'Nội dung không được vượt quá 5000 ký tự';
  } else {
    validationError.value = '';
  }
};

const onEditorReady = (quill) => {
  console.log('Editor sẵn sàng:', quill);
  
  // Thêm custom toolbar button
  const toolbar = quill.getModule('toolbar');
  toolbar.addHandler('custom-button', () => {
    const range = quill.getSelection();
    if (range) {
      quill.insertText(range.index, '[CUSTOM_TEXT]');
    }
  });
};

// Expose methods cho parent component
const getContent = () => article.value.content;
const setContent = (content) => {
  article.value.content = content;
};
const clearContent = () => {
  editorRef.value?.clear();
};

defineExpose({
  getContent,
  setContent,
  clearContent,
});
</script>

<style scoped>
.validation-error {
  color: #f53f3f;
  font-size: 14px;
  margin-top: 8px;
}

.editor-stats {
  margin-top: 12px;
  padding: 8px;
  background: #f7f8fa;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}
</style>
```

## 4. Sử dụng với Arco Design Form

```vue
<template>
  <a-form :model="form" :rules="rules" ref="formRef">
    <a-form-item label="Nội dung" field="content">
      <RichTextEditor
        v-model="form.content"
        name="content"
        :error="getFieldError('content')"
        @change="handleContentChange"
        @input="handleFormInput"
      />
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import RichTextEditor from '@/components/rich-text/index.vue';

const formRef = ref();
const form = reactive({
  content: '',
});

const rules = {
  content: [
    { required: true, message: 'Vui lòng nhập nội dung' },
  ],
};

const getFieldError = (field) => {
  return formRef.value?.getFieldError(field);
};

const handleContentChange = (content) => {
  // Clear validation error khi user đang nhập
  formRef.value?.clearValidate('content');
};

const handleFormInput = (event) => {
  // Trigger form validation
  formRef.value?.validateField('content');
};
</script>
```

## 5. Các Events có sẵn

| Event | Parameters | Mô tả |
|-------|------------|-------|
| `change` | `(content: string)` | Khi nội dung thay đổi |
| `input` | `(event: {target: {value: string, name: string}})` | Cho form validation |
| `focus` | `(event: any)` | Khi editor được focus |
| `blur` | `(event: any)` | Khi editor mất focus |
| `ready` | `(quill: any)` | Khi editor sẵn sàng |

## 6. Validation Rules thường dùng

```javascript
const validationRules = {
  // Kiểm tra không rỗng
  required: (value) => {
    const text = value.replace(/<[^>]*>/g, '');
    return text.trim().length > 0;
  },
  
  // Kiểm tra độ dài tối thiểu
  minLength: (min) => (value) => {
    const text = value.replace(/<[^>]*>/g, '');
    return text.length >= min;
  },
  
  // Kiểm tra độ dài tối đa
  maxLength: (max) => (value) => {
    const text = value.replace(/<[^>]*>/g, '');
    return text.length <= max;
  },
  
  // Kiểm tra số từ tối thiểu
  minWords: (min) => (value) => {
    const text = value.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length >= min;
  },
};
```
