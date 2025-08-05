"use strict";

const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      const transaction = await queryInterface.sequelize.transaction();

      try {
         const table = "material_sources";
         const description = "Material source locations and methods";
         const filePath = path.resolve(
            __dirname,
            "raw_sql/material_sources.sql"
         );

         console.log(`📥 Seeding ${table}: ${description}`);

         const countResult = await queryInterface.sequelize.query(
            `SELECT COUNT(*) as count FROM \`${table}\``,
            { type: Sequelize.QueryTypes.SELECT, transaction }
         );

         const rowCount = parseInt(countResult[0].count, 10);

         if (rowCount === 0) {
            if (fs.existsSync(filePath)) {
               const rawSQL = fs.readFileSync(filePath, "utf8");
               await queryInterface.sequelize.query(rawSQL, { transaction });
               console.log(`✅ Successfully seeded ${table}`);
            } else {
               console.warn(
                  `⚠️  SQL file not found: ${filePath}, skipping ${table}`
               );
            }
         } else {
            console.log(`ℹ️  ${table} already contains data, skipping`);
         }

         await transaction.commit();
         console.log("🎉 Material source data seeded successfully!");
      } catch (error) {
         await transaction.rollback();
         console.error("❌ Error seeding material sources:", error);
         throw error;
      }
   },

async down(queryInterface, Sequelize) {
   const transaction = await queryInterface.sequelize.transaction();

   try {
      await queryInterface.sequelize.query(
         "TRUNCATE TABLE `material_sources` RESTART IDENTITY CASCADE",
         { transaction }
      );
      console.log("🗑️ Cleared and reset IDs for material_sources");

      await transaction.commit();
      console.log("🧹 Material source data cleared and IDs reset successfully!");
   } catch (error) {
      await transaction.rollback();
      console.error("❌ Error clearing material sources data:", error);
      throw error;
   }
},
};
