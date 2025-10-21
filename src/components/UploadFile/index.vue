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

  const fileList = ref<any[]>([]);
  const accept = 'image/*';

  function handleCustomRequest(option) {
    const { file, onProgress, onSuccess, onError } = option;

    const formData = new FormData();
    formData.append('file', fileList.value[0].file as File);

    console.log({ file });

    // nếu backend cần thêm field khác:
    // formData.append('folder', 'avatars');

    // Ví dụ dùng fetch / axios:
    uploadFile(formData)
      .then(async (res) => {
        console.log({ res });

        if (!res.url) {
          throw new Error('Upload failed');
        }
        // const data = await res.json();
        // data có thể trả về url của file
        onSuccess(res, file);
      })
      .catch((err) => {
        onError(err);
      });
  }

  function handleChange(files) {
    console.log({ files });

    fileList.value = files;
  }
</script>
