<template>
    <div class="bg-white shadow-lg rounded-2xl p-6">
 
   <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#5984C6]">Order Management</h2>
      <p class="text-gray-600">Track and manage all service orders</p>
    </div>


    <h3 class="text-xl font-semibold text-gray-800 mb-4 p-4">All Orders</h3>

    <table class="min-w-full text-sm text-gray-700">
      <thead class="bg-[#5984C6] text-white">
        <tr>
          <th class="py-3 px-4 text-left">Order ID</th>
          <th class="py-3 px-4 text-left">Customer</th>
          <th class="py-3 px-4 text-left">Service</th>
          <th class="py-3 px-4 text-left">Provider</th>
          <th class="py-3 px-4 text-left">Amount</th>
          <th class="py-3 px-4 text-left">Date</th>
          <th class="py-3 px-4 text-left">time</th>
          <th class="py-3 px-4 text-left">Status</th>
          <th class="py-3 px-4 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
          class="border-t hover:bg-gray-50 transition"
        >
          <td class="py-3 px-4">{{ order.id }}</td>
          <td class="py-3 px-4">{{ order.customer }}</td>
          <td class="py-3 px-4">{{ order.service }}</td>
          <td class="py-3 px-4">{{ order.provider }}</td>
          <td class="py-3 px-4 font-semibold">${{ order.amount }}</td>
          <td class="py-3 px-4">{{ order.date }}</td>
          <td class="py-3 px-4">{{ order.time }}</td>
          <td class="py-3 px-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                order.status === 'Completed'
                  ? 'bg-green-100 text-green-600'
                  : order.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : order.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-red-100 text-red-600',
              ]"
            >
              {{ order.status }}
            </span>
          </td>

          <td class="py-3 px-4 flex space-x-2">
            <button
              @click="viewOrder(order)"
              class="p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition"
            >
              <i class="bi bi-eye"></i>
            </button>
            <div class="h-3 border-l border-gray-300 mt-3"></div>

            <button
              @click="editOrder(order)"
              class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 transition"
            >
              <i class="bi bi-pencil"></i>
            </button>
            <div class="h-3 border-l border-gray-300 mt-3"></div>

            <button
              @click="deleteOrder(order)"
              class="p-2 rounded-lg text-red-500 hover:bg-red-100 transition"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [
        {
          id: 'ORD-001',
          customer: 'Mohammed Ali',
          service: 'Plumbing',
          provider: 'Ali Mahmoud',
          amount: 150,
          date: '2024-03-15',
          time: '10:00 AM',
          status: 'Completed',
        },
      
      ],
    };
  },
  methods: {
    viewOrder(order) {
      alert(`Viewing details for ${order.id}`);
    },
    editOrder(order) {
      alert(`Editing ${order.id}`);
    },
    deleteOrder(order) {
      alert(`Deleting ${order.id}`);
    },
  },
};
</script>
