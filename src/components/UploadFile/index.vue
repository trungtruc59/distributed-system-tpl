<template>
  <a-upload
    :limit="1"
    :accept="accept"
    :file-list="fileList"
    :show-file-list="true"
    :custom-request="handleCustomRequest"
    :multiple="false"
    @change="handleChange"
  >
    <a-button type="primary"> Upload File </a-button>
  </a-upload>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import uploadFile from '@/api/upload';
  import { FileItem, RequestOption } from '@arco-design/web-vue';

  const fileList = ref<FileItem[]>([]);
  const accept = 'image/*';

  function handleCustomRequest(option: RequestOption) {
    const { onSuccess, onError } = option;

    const file = fileList.value[0].file as File;
    const formData = new FormData();
    formData.append('file', file);

    console.log({ file });

    // nếu backend cần thêm field khác:
    // formData.append('folder', 'avatars');

    // Ví dụ dùng fetch / axios:
    uploadFile(formData)
      .then(async (res) => {
        if (!res.url) {
          throw new Error('Upload failed');
        }
        // const data = await res.json();
        // data có thể trả về url của file
        onSuccess(res);
      })
      .catch((err) => {
        onError(err);
      });
  }

  function handleChange(_: FileItem[], fileItem: FileItem) {
    fileList.value = [fileItem];
  }
</script>
