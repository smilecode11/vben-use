<template>
  <s-table
    :columns="columns"
    :row-key="(record) => record.login.uuid"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
      <template v-else>{{ text }}</template>
    </template>
  </s-table>
</template>
<script lang="ts">
  import STable from '@surely-vue/table';

  import { computed, defineComponent, ref, onMounted } from 'vue';
  import axios from 'axios';

  type APIParams = {
    results: number;
    page?: number;
    sortField?: string;
    sortOrder?: number;
    [key: string]: any;
  };
  type APIResult = {
    results: {
      gender: 'female' | 'male';
      name: string;
      email: string;
    }[];
  };

  const queryData = (params: APIParams) => {
    return axios.get<APIResult>('https://randomuser.me/api?noinfo', { params });
  };

  export default defineComponent({
    components: {
      STable,
    },
    setup() {
      const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: true,
          // width: '20%',
        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          filters: [
            { text: 'Male', value: 'male' },
            { text: 'Female', value: 'female' },
          ],
          // width: '20%',
        },
        {
          title: 'Email',
          dataIndex: 'email',
        },
      ];

      const current = ref(1);
      const pageSize = ref(10);
      const dataSource: any = ref([]);
      const loading = ref(true);

      const pagination = computed(() => ({
        total: 200,
        current: current.value,
        pageSize: pageSize.value,
      }));

      const handleTableChange = async (
        pag: { pageSize: number; current: number },
        filters: any,
        sorter: any,
      ) => {
        console.log(
          '_',
          pag.pageSize,
          pag?.current,
          sorter.field,
          sorter.order,
          '_filters',
          filters,
        );

        current.value = pag.current;
        pageSize.value = pag.pageSize;

        const {
          data: { results = [] },
        } = await queryData({
          page: pagination.value.current,
          results: pagination.value.pageSize,
        });
        console.log('_result', results);
        loading.value = false;
        dataSource.value = results;
      };

      onMounted(async () => {
        const {
          data: { results = [] },
        } = await queryData({
          page: 1,
          results: 10,
        });
        console.log('_result', results);
        loading.value = false;
        dataSource.value = results;
      });

      return {
        dataSource,
        pagination,
        loading,
        columns,
        handleTableChange,
      };
    },
  });
</script>
