<template>
    <section class="testimonials pt-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold text-gray-800">Loved by Our Customers</h2>
          <p class="text-gray-600 mt-2">
            Trusted by thousands of users worldwide, ensuring the best experience.
          </p>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Example Testimonial Card -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img
                src="/assets/person.jpeg"
                alt="User Photo"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 class="text-lg font-semibold">John Doe</h4>
                <p class="text-sm text-gray-500">CEO at Example Co.</p>
              </div>
            </div>
            <div class="stars mb-2 text-yellow-500">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
            </div>
            <p class="text-gray-600">
              This platform has completely transformed how we work. The ease of
              use and outstanding support are unmatched!
            </p>
          </div>
  
          <!-- Additional Testimonial Cards -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img
                src="/assets/person.jpeg"
                alt="User Photo"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 class="text-lg font-semibold">Jane Smith</h4>
                <p class="text-sm text-gray-500">Marketing Director</p>
              </div>
            </div>
            <div class="stars mb-2 text-yellow-500">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <p class="text-gray-600">
              Amazing! The service exceeded our expectations and delivered real
              value to our organization.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img
                src="/assets/person.jpeg"
                alt="User Photo"
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 class="text-lg font-semibold">Jane Smith</h4>
                <p class="text-sm text-gray-500">Marketing Director</p>
              </div>
            </div>
            <div class="stars mb-2 text-yellow-500">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <p class="text-gray-600">
              Amazing! The service exceeded our expectations and delivered real
              value to our organization.
            </p>
          </div>
  
          <!-- Add more testimonial cards here as needed -->
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "TestimonialsSection",
  };
  </script>
  
  <style scoped>
  .stars i {
    margin-right: 2px;
  }
  </style>
  