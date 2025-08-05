"use strict";

const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
async up(queryInterface) {
   const sqlBaseDir = path.resolve(__dirname, "raw_sql");
   const transaction = await queryInterface.sequelize.transaction();

   try {
      const allTables = [
         // Recipe-related tables
         { table: "professions", file: "professions.sql" },
         { table: "recipe_ranks", file: "recipe_ranks.sql" },
         { table: "recipe_categories", file: "recipe_categories.sql" },
         { table: "recipes", file: "recipes.sql" },
         { table: "materials", file: "materials.sql" },
         { table: "recipe_materials", file: "recipe_materials.sql" },

         // Preset-related tables
         { table: "quest_ranks", file: "quest_ranks.sql" },
         { table: "life_ranks", file: "life_ranks.sql" },
         { table: "bis_categories", file: "bis_categories.sql" },
         { table: "marco_ranks", file: "marco_ranks.sql" },
         { table: "recipe_life_ranks", file: "recipe_life_ranks.sql" },
         { table: "recipe_bis", file: "recipe_bis.sql" },
         { table: "recipe_marco", file: "recipe_marco.sql" },
      ];

      for (const { table, file } of allTables) {
         console.log(`📥 Seeding ${table}...`);
         const filePath = path.join(sqlBaseDir, file);

         if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ Missing SQL file for ${table}: ${file}`);
            continue;
         }

         const sql = fs.readFileSync(filePath, "utf8");

         try {
            await queryInterface.sequelize.query(sql, { transaction });
            console.log(`✅ ${table} seeded`);
         } catch (error) {
            console.error(`❌ Failed to seed ${table}:`, error.message);
            throw error;
         }
      }

      await transaction.commit();
      console.log("🎉 All data seeded successfully.");
   } catch (error) {
      await transaction.rollback();
      console.error("❌ Error during seeding, rolling back changes:", error.message);
      throw error;
   }
},

   async down(queryInterface) {
      const tables = [
         "recipe_marco",
         "recipe_bis",
         "recipe_life_ranks",
         "marco_ranks",
         "bis_categories",
         "life_ranks",
         "quest_ranks",
         "recipe_materials",
         "materials",
         "recipes",
         "recipe_categories",
         "recipe_ranks",
         "professions",
      ];

      for (const table of tables) {
         await queryInterface.sequelize.query(`TRUNCATE TABLE \`${table}\` RESTART IDENTITY CASCADE`);
         console.log(`🗑️ Cleared and reset IDs for ${table}`);
      }

      console.log("🧹 All seeded data removed.");
   },
};
