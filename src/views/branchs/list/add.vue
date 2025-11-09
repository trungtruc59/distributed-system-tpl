<template>
    <div class="wrap-main">
        <Breadcrumb :routes="breadcrumbRoutes" />
        <a-card class="general-card" :title="'Thêm chi nhánh mới'">
            <a-row class="wrapper">
                <a-col :span="24">
                    <a-form ref="formRef" label-align="left" :label-col-props="{ span: 10, offset: 0 }" :wrapper-col-props="{ span: 24 }" :model="dataForm" class="form">
                        <a-row :gutter="24">
                            <a-col :xs="{ span: 24, offset: 0 }" :sm="{ span: 24, offset: 0 }" :md="{ span: 12, offset: 0 }" :lg="{ span: 12, offset: 0 }">
                                <a-form-item
                                    field="name"
                                    :label="'Tên chi nhánh'"
                                    :rules="[
                                        {
                                            required: true,
                                            message: 'Tên không được để trống',
                                        },
                                    ]"
                                >
                                    <a-input v-model="dataForm.name" :placeholder="'Nhập tên chi nhánh'" />
                                </a-form-item>
                                <a-form-item
                                    field="phone"
                                    :label="'Số điện thoại'"
                                    :label-col-props="{ span: 16 }"
                                    :rules="[
                                  { required: true, message: 'Số điện thoại không được để trống' },
                                  {
                                      validator: (value: string, cb: any) => {
                                          const phoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/;
                                          if (!phoneRegex.test(value)) {
                                              cb('Số điện thoại không hợp lệ');
                                          } else {
                                              cb();
                                          }
                                      },
                                  },
                                  { pattern: /^[0-9]+$/, message: 'Số điện thoại chỉ được chứa chữ số' },
                              ]"
                                    :validate-trigger="['change', 'blur']"
                                >
                                    <a-input
                                        v-model="dataForm.phone"
                                        class="cus-input"
                                        :placeholder="$t('register.form.phone.placeholder')"
                                        type="tel"
                                        inputmode="numeric"
                                        @input="dataForm.phone = dataForm.phone.replace(/\D/g, '')"
                                    >
                                        <template #prefix>
                                            <icon-user />
                                        </template>
                                    </a-input>
                                </a-form-item>
                                
                                <a-form-item
                                    field="address"
                                    :label="'Địa chỉ'"
                                    :rules="[
                                        {
                                            required: true,
                                            message: 'Địa chỉ không được để trống',
                                        },
                                    ]"
                                >
                                    <a-input v-model="dataForm.address" :placeholder="'Nhập địa chỉ chi nhánh'" />
                                </a-form-item>

                                <a-row :gutter="24">
                                    <a-col :span="12">
                                        <a-form-item :label-col-props="{ span: 16 }" :wrapper-col-props="{ span: 24 }" field="openTime" label="Giờ mở cửa" feedback>
                                            <a-time-picker format="HH:mm" v-model="dataForm.openTime" :placeholder="'Vui lòng chọn thời gian'" style="width: 100%; margin-left: 2px" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item :label-col-props="{ span: 16 }" :wrapper-col-props="{ span: 24 }" field="closeTime" label="Giờ đóng cửa" feedback>
                                            <a-time-picker format="HH:mm" v-model="dataForm.closeTime" :placeholder="'Vui lòng chọn thời gian'" style="width: 100%; margin-left: 2px" />
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                              
                            </a-col>
                            <a-col :xs="{ span: 24, offset: 0 }" :sm="{ span: 24, offset: 0 }" :md="{ span: 12, offset: 0 }" :lg="{ span: 12, offset: 0 }">
                              <div class="box-banner mb-5">
                                <a-form-item class="box-img"  label="Ảnh Banner ( Width:600 - Height:300 )" :label-col-props="{ span: 20 }" :wrapper-col-props="{ span: 20 }">
                                  <div class="banner-img" v-if="dataForm.thumbnail != ''">
                                      <a-image style="margin-right: 20px" width="300" :src="dataForm.thumbnail" />
                                  </div>
                                </a-form-item>
                                <UploadFile @getUrlImg="handleGetUrlImg" :default-file-list="defaultFileList" />
                              </div>
                              <div class="box-banner">
                                <a-form-item class="box-img"  label="Ảnh Logo ( Width:150 - Height:150 )" :label-col-props="{ span: 20 }" :wrapper-col-props="{ span: 20 }">
                                  <div class="banner-img" v-if="dataForm.logo != ''">
                                      <a-image style="margin-right: 20px" width="150" :src="dataForm.logo" />
                                  </div>
                                </a-form-item>
                                <UploadFile @getUrlImg="handleGetUrlAvt" :default-file-list="defaultFileList" />
                              </div>
                            </a-col>
                        </a-row>

                        <a-row :gutter="24" :justify="'center'">
                            <a-col style="margin-top: 20px">
                                <a-form-item>
                                    <a-space>
                                        <a-button type="primary" @click="validate({ errors: formRef.value?.getFieldsError(), values: dataForm })"> Thêm chi nhánh </a-button>
                                        <a-button type="secondary" @click="cancelUpdate"> Huỷ bỏ </a-button>
                                    </a-space>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';
    import Breadcrumb from '@/components/breadcrumb/index.vue';
    import { FormInstance, Message } from '@arco-design/web-vue';
    import { BranchRequest } from '@/types/branchTypes';
    import UploadFile from '@/components/UploadFile/index.vue';
    import useLoading from '@/hooks/loading';
    import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
    import { useRouter, useRoute } from 'vue-router';
    import useBranchStore from '@/store/modules/branches';

    const { loading, setLoading } = useLoading();
    const route = useRoute();
    const router = useRouter();
    const { redirect, ...othersQuery } = route.query;
    const errorMessage = ref<string>('');
    const breadcrumbRoutes = [
        { path: '/dashboard', label: 'Trang chủ' },
        { path: '/branchs/list', label: 'Danh sách chi nhánh' },
        { path: '/branchs/add', label: 'Thêm chi nhánh' },
    ];
    const formRef = ref<FormInstance>();
    const dataForm = ref<BranchRequest>({
        name: '',
        address: '',
        phone: '',
        thumbnail: '',
        logo: '',
        closeTime: '',
        openTime: '',
    });

    const handleGetUrlImg = (url: string) => {
        dataForm.value.thumbnail = url;
    };
    const handleGetUrlAvt = (url: string) => {
        dataForm.value.logo = url;
    };
    const defaultFileList = ref<{ id:string ,name: string; url: string;}[]>([]);

    const validate = async ({ errors, values }: { errors: Record<string, ValidatedError> | undefined; values: Record<string, any> }) => {
        if (loading.value) return;
        if (!errors) {
            setLoading(true);
            try {
              const today = new Date().toISOString().split("T")[0];

              // Chuyển format giờ sang ISO
              if (dataForm.value.openTime) {
                dataForm.value.openTime = `${today}T${dataForm.value.openTime}:00`;
              }
              if (dataForm.value.closeTime) {
                dataForm.value.closeTime = `${today}T${dataForm.value.closeTime}:00`;
              }
              // Call API to create branch
              useBranchStore().createBranch(dataForm.value);
              Message.success('Tạo chi nhánh thành công');
              router.push({
                  name: 'ListBranchs',
                  query: {
                      ...othersQuery,
                  },
              });
            } catch (err) {
                console.log(err);

                errorMessage.value = (err as Error).message;
            } finally {
                setLoading(false);
            }
        }
    };
    const cancelUpdate = async () => {
        router.push({
            name: 'List',
            query: {
                ...othersQuery,
            },
        });
    };
</script>

<script lang="ts">
    export default {
        name: 'Setting',
    };
</script>

<style scoped lang="less">
    .wrap-main {
        padding: 0 20px 20px 20px;
    }

    .wrapper {
        padding: 20px 20px;
        min-height: 580px;
        background-color: var(--color-bg-2);
        border-radius: 4px;
    }

    :deep(.section-title) {
        margin-top: 0;
        margin-bottom: 16px;
        font-size: 14px;
    }
    :deep(.arco-form-item-content){
      min-height: 0;
    }
    .box-banner {
      .box-img {
        margin-bottom: 0;
        :deep(.arco-form-item-wrapper-col) {
          min-height: 0;
        }
      }
    }
</style>
