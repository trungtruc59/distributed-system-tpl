<template>
  <a-upload
    class="avatar"
    action="/"
    :limit="1"
    :accept="accept"
    :file-list="fileList"
    :default-file-list="fileList"
    :show-file-list="true"
    :custom-request="handleCustomRequest"
    :multiple="false"
    @change="handleChange"
  >
    <template #upload-button>
        <div
          :class="`arco-upload-list-item${
            fileList[0] && fileList[0].status === 'error' ? ' arco-upload-list-item-error' : ''
          }`"
        >
          <div
            class="arco-upload-list-picture custom-upload-avatar"
            v-if="fileList[0] && fileList[0].url"
          >
            <img :src="fileList[0].url" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
            <a-progress
              v-if="fileList[0].status === 'uploading' && fileList[0].percent < 100"
              :percent="fileList[0].percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
            />
          </div>
          <div class="arco-upload-picture-card" v-else>
            <div class="arco-upload-picture-card-text">
              <IconPlus />
              <div style="margin-top: 10px; font-weight: 600">Upload</div>
            </div>
          </div>
        </div>
      </template>
  </a-upload>
</template>

<script setup lang="ts">
  import { ref,defineProps } from 'vue';
  import uploadFile from '@/api/upload';
  import { FileItem, RequestOption } from '@arco-design/web-vue';

  const props = defineProps<{
    defaultFileList: FileItem[];
  }>();

  const emit = defineEmits(['getUrlImg']);
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
        emit('getUrlImg', res.url);
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
