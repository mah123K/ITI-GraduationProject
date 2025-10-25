<template>
 <div class="bg-white shadow-lg rounded-2xl p-6">
 
   <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#5984C6]">Payment Management</h2>
      <p class="text-gray-600">Track all transactions and payments</p>
    </div>


    <h3 class="text-xl font-semibold text-gray-800 mb-4 p-4">All Transactions</h3>

    <table class="min-w-full text-sm text-gray-700">
      <thead class="bg-[#5984C6] text-white">
        <tr>
          <th class="py-3 px-4 text-left">Payment ID</th>
          <th class="py-3 px-4 text-left">Customer</th>
          <th class="py-3 px-4 text-left">Order ID</th>
          <th class="py-3 px-4 text-left">Amount</th>
          <th class="py-3 px-4 text-left">Method</th>
          <th class="py-3 px-4 text-left">Date</th>
          <th class="py-3 px-4 text-left">Status</th>
          <th class="py-3 px-4 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="payment in payments"
          :key="payment.id"
           class="border-t hover:bg-[#f3f9fc] transition"
        >
          <td class="py-3 px-4">{{ payment.id }}</td>
          <td class="py-3 px-4">{{ payment.customer }}</td>
          <td class="py-3 px-4">{{ payment.orderId }}</td>
          <td class="py-3 px-4 font-semibold">${{ payment.amount }}</td>
          <td class="py-3 px-4">{{ payment.method }}</td>
          <td class="py-3 px-4">{{ payment.date }}</td>
          <td class="py-3 px-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                payment.status === 'Completed'
                  ? 'bg-green-100 text-green-600'
                  : payment.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600',
              ]"
            >
              {{ payment.status }}
            </span>
          </td>

          <td class="py-3 px-4 flex space-x-2">
            <button
              @click="viewPayment(payment)"
              class="p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition"
            >
              <i class="bi bi-eye"></i>
            </button>

            <div class="h-3 border-l border-gray-300 mt-3"></div>

            <button
              @click="editPayment(payment)"
              class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 transition"
            >
              <i class="bi bi-pencil"></i>
            </button>

            <div class="h-3 border-l border-gray-300 mt-3"></div>

            <button
              @click="deletePayment(payment)"
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
      payments: [
        {
          id: 'PAY-001',
          customer: 'Mohammed Ali',
          orderId: 'ORD-001',
          amount: 150,
          method: 'Credit Card',
          date: '2024-03-15',
          status: 'Completed',
        }
      
      ],
    };
  },
  methods: {
    viewPayment(payment) {
      alert(`Viewing details for ${payment.id}`);
    },
    editPayment(payment) {
      alert(`Editing ${payment.id}`);
    },
    deletePayment(payment) {
      alert(`Deleting ${payment.id}`);
    },
  },
};
</script>
