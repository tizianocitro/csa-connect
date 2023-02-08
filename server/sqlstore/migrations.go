package sqlstore

import (
	"github.com/blang/semver"
	"github.com/jmoiron/sqlx"
	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/pkg/errors"
)

type Migration struct {
	fromVersion   semver.Version
	toVersion     semver.Version
	migrationFunc func(sqlx.Ext, *SQLStore) error
}

const MySQLCharset = "DEFAULT CHARACTER SET utf8mb4"

var migrations = []Migration{
	{
		fromVersion: semver.MustParse("0.0.0"),
		toVersion:   semver.MustParse("0.1.0"),
		migrationFunc: func(e sqlx.Ext, sqlStore *SQLStore) error {
			if e.DriverName() == model.DatabaseDriverMysql {
				if _, err := e.Exec(`
					CREATE TABLE IF NOT EXISTS MP_System (
						SKey VARCHAR(64) PRIMARY KEY,
						SValue VARCHAR(1024) NULL
					)
				` + MySQLCharset); err != nil {
					return errors.Wrapf(err, "failed creating table MP_System")
				}

				if _, err := e.Exec(`
					CREATE TABLE IF NOT EXISTS MP_Product (
						CreatedAt BIGINT NOT NULL DEFAULT 0,
						ID VARCHAR(26) PRIMARY KEY,
						IsFavorite BOOLEAN NOT NULL,
						LastUpdatedAt BIGINT NOT NULL DEFAULT 0,
						Name VARCHAR(1024) NOT NULL,
						Summary VARCHAR(4096) NOT NULL DEFAULT '',
						SummaryModifiedAt BIGINT NOT NULL DEFAULT 0
					)
				` + MySQLCharset); err != nil {
					return errors.Wrapf(err, "failed creating table MP_Product")
				}

				if _, err := e.Exec(`
					CREATE TABLE IF NOT EXISTS MP_Element (
						Description VARCHAR(4096) NOT NULL DEFAULT '',
						ID VARCHAR(26) PRIMARY KEY,
						Name VARCHAR(1024) NOT NULL,
						ProductID VARCHAR(26) NOT NULL REFERENCES MP_Product(ID)
					)
				` + MySQLCharset); err != nil {
					return errors.Wrapf(err, "failed creating table MP_Element")
				}

				if _, err := e.Exec(`
					CREATE TABLE IF NOT EXISTS MP_Channel (
						ID VARCHAR(26) PRIMARY KEY,
						Name VARCHAR(1024) NOT NULL,
						ProductID VARCHAR(26) NOT NULL REFERENCES MP_Product(ID)
					)
				` + MySQLCharset); err != nil {
					return errors.Wrapf(err, "failed creating table MP_Channel")
				}
			} else {
				if _, err := e.Exec(`
					CREATE TABLE IF NOT EXISTS MP_System (
						SKey VARCHAR(64) PRIMARY KEY,
						SValue VARCHAR(1024) NULL
					);
				`); err != nil {
					return errors.Wrapf(err, "failed creating table MP_System")
				}

				if _, err := e.Exec(`
					CREATE TABLE IF NOT EXISTS MP_Product (
						CreatedAt BIGINT NOT NULL DEFAULT 0,
						ID TEXT PRIMARY KEY,
						IsFavorite BOOLEAN NOT NULL,
						LastUpdatedAt BIGINT NOT NULL DEFAULT 0,
						Name TEXT NOT NULL,
						Summary TEXT NOT NULL DEFAULT '',
						SummaryModifiedAt BIGINT NOT NULL DEFAULT 0
					);
				`); err != nil {
					return errors.Wrapf(err, "failed creating table MP_Product")
				}

				if _, err := e.Exec(`
					CREATE TABLE IF NOT EXISTS MP_Element (
						Description TEXT NOT NULL DEFAULT '',
						ID TEXT PRIMARY KEY,
						Name TEXT NOT NULL,
						ProductID TEXT NOT NULL REFERENCES MP_Product(ID)
					);
				`); err != nil {
					return errors.Wrapf(err, "failed creating table MP_Element")
				}

				if _, err := e.Exec(`
					CREATE TABLE IF NOT EXISTS MP_Channel (
						ID TEXT PRIMARY KEY,
						Name TEXT NOT NULL,
						ProductID TEXT NOT NULL REFERENCES MP_Product(ID)
					);
				`); err != nil {
					return errors.Wrapf(err, "failed creating table MP_Channel")
				}
			}

			return nil
		},
	},
	{
		fromVersion: semver.MustParse("0.1.0"),
		toVersion:   semver.MustParse("0.2.0"),
		migrationFunc: func(e sqlx.Ext, sqlStore *SQLStore) error {
			// prior to v1.0.0 of the plugin, this migration was used to trigger the data migration from the kvstore
			return nil
		},
	},
	{
		fromVersion: semver.MustParse("0.2.0"),
		toVersion:   semver.MustParse("0.3.0"),
		migrationFunc: func(e sqlx.Ext, sqlStore *SQLStore) error {
			if e.DriverName() == model.DatabaseDriverMysql {
				if _, err := e.Exec(`ALTER TABLE MP_System CONVERT TO CHARACTER SET utf8mb4`); err != nil {
					return errors.Wrapf(err, "failed to migrate character set")
				}
			}
			return nil
		},
	},
}
