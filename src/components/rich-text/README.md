# Rich Text Editor Component

Component rich text editor sử dụng @vueup/vue-quill 1.2.0 với các tính năng chỉnh sửa văn bản phong phú.

## Cài đặt

Package đã được cài đặt trong `package.json`:
```json
"@vueup/vue-quill": "^1.2.0"
```

## Sử dụng

### Import component
```vue
<template>
  <RichTextEditor
    v-model="content"
    placeholder="Nhập nội dung..."
    :height="300"
    toolbar="full"
    @ready="onEditorReady"
  />
</template>

<script setup>
import RichTextEditor from '@/components/rich-text/index.vue';
import { ref } from 'vue';

const content = ref('<p>Nội dung mặc định</p>');

const onEditorReady = (quill) => {
  console.log('Editor đã sẵn sàng:', quill);
};
</script>
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `modelValue` | `string` | `''` | Nội dung HTML của editor |
| `placeholder` | `string` | `'Nhập nội dung...'` | Text placeholder |
| `readonly` | `boolean` | `false` | Chế độ chỉ đọc |
| `disabled` | `boolean` | `false` | Vô hiệu hóa editor |
| `height` | `string \| number` | `'200px'` | Chiều cao editor |
| `toolbar` | `string[] \| 'full' \| 'minimal'` | `'full'` | Cấu hình toolbar |
| `theme` | `'snow' \| 'bubble'` | `'snow'` | Theme của editor |

## Events

| Event | Parameters | Mô tả |
|-------|------------|-------|
| `update:modelValue` | `(value: string)` | Khi nội dung thay đổi |
| `ready` | `(quill: any)` | Khi editor sẵn sàng |
| `focus` | `(event: any)` | Khi editor được focus |
| `blur` | `(event: any)` | Khi editor mất focus |

## Exposed Methods

Có thể truy cập các method thông qua ref:

```vue
<template>
  <RichTextEditor ref="editorRef" />
  <button @click="insertText">Thêm text</button>
  <button @click="clearContent">Xóa nội dung</button>
</template>

<script setup>
import { ref } from 'vue';

const editorRef = ref();

const insertText = () => {
  editorRef.value?.insertText('Text mới');
};

const clearContent = () => {
  editorRef.value?.clear();
};
</script>
```

### Methods có sẵn:

- `getQuillInstance()`: Lấy instance Quill gốc
- `insertText(text: string)`: Chèn text vào vị trí cursor
- `insertHTML(html: string)`: Chèn HTML vào vị trí cursor
- `getText()`: Lấy nội dung dạng text thuần
- `getHTML()`: Lấy nội dung dạng HTML
- `clear()`: Xóa toàn bộ nội dung
- `focus()`: Focus vào editor
- `blur()`: Blur khỏi editor

## Cấu hình Toolbar

### Toolbar đầy đủ (full)
Bao gồm tất cả các công cụ: headers, formatting, colors, lists, alignment, links, images, etc.

### Toolbar tối giản (minimal)
Chỉ bao gồm: bold, italic, underline, lists, link, clean.

### Toolbar tùy chỉnh
```vue
<RichTextEditor
  :toolbar="[
    ['bold', 'italic'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link']
  ]"
/>
```

## Ví dụ nâng cao

### Editor với validation
```vue
<template>
  <div>
    <RichTextEditor
      v-model="content"
      :height="400"
      @blur="validateContent"
    />
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const content = ref('');
const error = ref('');

const validateContent = () => {
  const text = content.value.replace(/<[^>]*>/g, ''); // Remove HTML tags
  if (text.length < 10) {
    error.value = 'Nội dung phải có ít nhất 10 ký tự';
  } else {
    error.value = '';
  }
};
</script>
```

### Editor với upload hình ảnh
```vue
<template>
  <RichTextEditor
    ref="editorRef"
    v-model="content"
    @ready="setupImageUpload"
  />
</template>

<script setup>
import { ref } from 'vue';

const editorRef = ref();
const content = ref('');

const setupImageUpload = (quill) => {
  const toolbar = quill.getModule('toolbar');
  toolbar.addHandler('image', () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        // Upload file và lấy URL
        const imageUrl = await uploadImage(file);
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      }
    };
  });
};

const uploadImage = async (file) => {
  // Implement upload logic
  return 'https://example.com/image.jpg';
};
</script>
```
