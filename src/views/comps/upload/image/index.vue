<template>
  <PageWrapper dense contentFullHeight fixedHeight>
    <div class="container">
      <UploadImages />
      <UploadImageForm />
      <UploadAvatarCropper />
      <BasicCropper />
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import BasicCropper from './BasicCropper.vue';
  import UploadAvatarCropper from './UploadAvatarCropper.vue';
  import UploadImages from './UploadImages.vue';
  import UploadImageForm from './UploadImageForm.vue';

  defineOptions({ name: 'CompsUploadImage' });
</script>
