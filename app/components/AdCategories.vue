<template>
  <aside class="max-w-xl bg-white rounded-lg shadow-sm p-4 grid grid-cols-2">
    <div class="space-y-4 col-span-1 border max-h-min">
      <!-- Category Item -->
      <div v-for="category in categories" :key="category.name"
        class="flex items-center gap-6 justify-between space-x-3 hover:bg-gray-50 rounded-md cursor-pointer">
        <div class="flex gap-2 items-center">
          <CategoryIcon :icon="category.icon" />
          <div class="">
            <p class="font-medium text-sm mb-0">{{ category.name }}</p>
            <span class="text-xs text-gray-600 block">{{ category.adCount }}</span>
          </div>
        </div>
        <img src="/assets/images/svg/category-menu.svg" alt="category menu icon">
      </div>
    </div>
    <div class="col-span-1">
      <p class="">This will contain the subcategories</p>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import Vehicle from '@/assets/images/categories/vehicles.png';
import Mobiles from '@/assets/images/categories/mobiles.png';
import Properties from '@/assets/images/categories/properties.png';
import Appliances from '@/assets/images/categories/home-appliances.png';
import Beauty from '@/assets/images/categories/beauty.png';
import Fashion from '@/assets/images/categories/fashion.png';
import Services from '@/assets/images/categories/services.png';
import Jobs from '@/assets/images/categories/jobs.png';
import Animals from '@/assets/images/categories/animals.png';
import Foods from '@/assets/images/categories/food-agriculture.png';
import Repairs from '@/assets/images/categories/repair-construction.png';
const categories = [
  { name: 'Vehicles', icon: Vehicle, adCount: '14,132' },
  { name: 'Mobile Phones & Tablets', icon: Mobiles, adCount: '14,132' },
  { name: 'Properties', icon: Properties, adCount: '14,132' },
  { name: 'Home Appliances', icon: Appliances, adCount: '14,132' },
  { name: 'Beauty & Personal Care', icon: Beauty, adCount: '14,132' },
  { name: 'Fashion', icon: Fashion, adCount: '14,132' },
  { name: 'Services', icon: Services, adCount: '14,132' },
  { name: 'Jobs', icon: Jobs, adCount: '14,132' },
  { name: 'Animals & Pets', icon: Animals, adCount: '14,132' },
  { name: 'Food & Agriculture', icon: Foods, adCount: '14,132' },
  { name: 'Repair & Construction', icon: Repairs, adCount: '14,132' }
];

</script>

<style></style>