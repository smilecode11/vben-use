<template>
  <PageWrapper dense contentFullHeight fixedHeight>
    <UploadImages />
    <BasicCropper />
    <UploadAvatarCropper />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import BasicCropper from './BasicCropper.vue';
  import UploadAvatarCropper from './UploadAvatarCropper.vue';
  import UploadImages from './UploadImages.vue';

  defineOptions({ name: 'CompsUploadImage' });
</script>
