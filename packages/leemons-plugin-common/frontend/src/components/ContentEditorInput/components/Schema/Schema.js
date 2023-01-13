import React from 'react';
import { Box, TextClamp, FileItemDisplay } from '@bubbles-ui/components';
import { ArrowRightIcon } from '@bubbles-ui/icons/outline';
import { SchemaStyles } from './Schema.styles';
import { SCHEMA_DEFAULT_PROPS, SCHEMA_PROP_TYPES } from './Schema.constants';

// eslint-disable-next-line import/prefer-default-export
export const Schema = ({ schema, schemaLabel, isSchemaOpened, setIsSchemaOpened }) => {
  const { classes } = SchemaStyles({ isSchemaOpened }, { name: 'ContentEditor-Schema' });

  return (
    <Box className={classes.schemaContainer}>
      <Box className={classes.schemaTranslate}>
        <Box className={classes.schemaHeader}>
          <Box className={classes.schemaLabel}>{schemaLabel}</Box>
          <ArrowRightIcon
            className={classes.arrowIcon}
            height={20}
            width={20}
            onClick={() => setIsSchemaOpened(!isSchemaOpened)}
          />
        </Box>
        <Box className={classes.schema}>
          {schema.map((element, index) => {
            const { level } = element.attrs;
            const isLibrary = element.type === 'library';

            // If it is a paragraph, there is no content or a title lower than h2 we do not print it.
            if (
              element.type === 'paragraph' ||
              (!element.content && !isLibrary) ||
              (element.type === 'heading' && level > 2)
            )
              return false;

            const schemaElementName = isLibrary
              ? `${element.attrs.asset.name}.${element.attrs.asset.fileExtension}`.toLowerCase()
              : element.content[0].text;

            return (
              <Box key={index}>
                {isLibrary ? (
                  <Box style={{ overflow: 'hidden', paddingLeft: 10 }}>
                    <FileItemDisplay size={18} filename={schemaElementName} />
                  </Box>
                ) : (
                  <TextClamp lines={1}>
                    <Box className={classes[`${level === 1 ? 'title' : 'subtitle'}`]}>
                      {schemaElementName}
                    </Box>
                  </TextClamp>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

Schema.defaultProps = SCHEMA_DEFAULT_PROPS;
Schema.propTypes = SCHEMA_PROP_TYPES;
