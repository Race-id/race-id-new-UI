<template>
  <div class="depth-frame">
    <div class="depth-frame-wrapper">
      <div class="div-wrapper">
        <div class="text-wrapper">Race.id</div>
      </div>
    </div>

    <div class="div">
      <div class="div-2">
        <div class="div-wrapper">
          <div class="text-wrapper-2">Home</div>
        </div>

        <div class="div-wrapper">
          <div class="text-wrapper-2">Race</div>
        </div>

        <div class="div-wrapper">
          <div class="text-wrapper-2">FAQ</div>
        </div>

        <div class="div-wrapper">
          <div class="text-wrapper-3">About Us</div>
        </div>

        <div class="div-3" />

        <div class="div-4" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DepthFrame",
};
</script>

<style>
.depth-frame {
  align-items: center;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-color: #e5e8ea;
  display: flex;
  justify-content: space-between;
  padding: 12px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.depth-frame .depth-frame-wrapper {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 16px;
  position: relative;
}

.depth-frame .div-wrapper {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  position: relative;
}

.depth-frame .text-wrapper {
  align-self: stretch;
  color: #111416;
  font-family: "Lexend-Bold", Helvetica;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 23px;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
}

.depth-frame .div {
  align-items: flex-start;
  display: flex;
  flex: 1;
  flex-grow: 1;
  gap: 32px;
  justify-content: flex-end;
  position: relative;
}

.depth-frame .div-2 {
  align-items: center;
  display: flex;
  gap: 66px;
  height: 40px;
  position: relative;
  width: 372px;
}

.depth-frame .text-wrapper-2 {
  align-self: stretch;
  color: #111416;
  font-family: "Lexend-Medium", Helvetica;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 21px;
  margin-top: -1.00px;
  position: relative;
  white-space: nowrap;
}

.depth-frame .text-wrapper-3 {
  align-self: stretch;
  color: #111416;
  font-family: "Lexend-Medium", Helvetica;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 21px;
  margin-top: -1.00px;
  position: relative;
}

.depth-frame .div-3 {
  flex: 0 0 auto;
  margin-right: -145.00px;
  position: relative;
}

.depth-frame .div-4 {
  flex: 0 0 auto;
  margin-right: -273.00px;
  position: relative;
}
</style>